import { useState } from "react";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HistoryIcon from "@mui/icons-material/History";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../Util/Notification";
import { mergePriorAccount } from "../../api/auth";
import {
  linkEmailPassword,
  linkGoogle,
  priorAccountTokenWithEmail,
  priorAccountTokenWithGoogle,
  startPhoneLink,
  startPriorAccountPhoneProof,
} from "../../firebase/linkMethods";

const METHODS = [
  { id: "password", label: "Email & password", Icon: EmailOutlinedIcon },
  { id: "phone", label: "Phone", Icon: SmsOutlinedIcon },
  { id: "google.com", label: "Google", Icon: GoogleIcon },
];

const identifierFor = (entry) => entry?.email || entry?.phoneNumber || "Linked";

/** Sign-in methods + the door to a previous account's history. One firebase
 * user carries every linked method, so all of them open the same account. */
const AuthMethods = () => {
  const { auth } = useAuth();
  const { showNotification } = useNotification();
  const [expanded, setExpanded] = useState(null); // 'password' | 'phone' | merge keys
  const [busy, setBusy] = useState(false);

  // link-form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [phoneConfirm, setPhoneConfirm] = useState(null);

  // merge-flow state
  const [mergeMethod, setMergeMethod] = useState(null);
  const [mergeProof, setMergeProof] = useState(null); // phone confirmation

  const providerData = auth?.currentUser?.providerData || [];
  const linked = Object.fromEntries(
    providerData.map((entry) => [entry.providerId, entry])
  );

  const finishLink = async (label) => {
    await auth.currentUser.reload();
    showNotification(`${label} is now linked to this account.`, "success");
    setExpanded(null);
    setEmail("");
    setPassword("");
    setPhone("");
    setCode("");
    setPhoneConfirm(null);
  };

  const runLink = async (label, fn) => {
    if (busy) return;
    setBusy(true);
    try {
      await fn();
      await finishLink(label);
    } catch (error) {
      showNotification(error.message);
    } finally {
      setBusy(false);
    }
  };

  const finishMerge = async (token) => {
    const moved = await mergePriorAccount(token);
    const bits = [];
    if (moved.leagues_owned) bits.push(`${moved.leagues_owned} league(s) owned`);
    if (moved.players) bits.push(`${moved.players} player identit${moved.players === 1 ? "y" : "ies"}`);
    if (moved.member_of) bits.push(`${moved.member_of} league membership(s)`);
    showNotification(
      `Accounts merged${bits.length ? ` — moved ${bits.join(", ")}` : ""}.` +
        (moved.conflicts?.length
          ? ` Heads up: you already had an identity in ${moved.conflicts.join(
              ", "
            )}; ask your commissioner to consolidate that history.`
          : " You can now link that sign-in method above."),
      "success"
    );
    setTimeout(() => location.reload(), 2500);
  };

  const runMerge = async (getToken) => {
    if (busy) return;
    setBusy(true);
    try {
      await finishMerge(await getToken());
    } catch (error) {
      showNotification(error.message);
      setBusy(false);
    }
  };

  return (
    <>
      <div className="p-3 bg-white border border-gray-200 rounded-lg">
        <h4 className="text-sm font-semibold">Sign-in methods</h4>
        <p className="text-[11px] text-light">
          Any linked method opens this same account and all its history.
        </p>
        <div className="mt-1 divide-y divide-gray-50">
          {METHODS.map(({ id, label, Icon }) => {
            const entry = linked[id];
            return (
              <div key={id} className="py-2">
                <div className="flex items-center gap-2">
                  <Icon sx={{ fontSize: 18 }} className="shrink-0 text-light" />
                  <div className="flex flex-col min-w-0 flex-grow">
                    <span className="text-sm font-medium leading-tight">
                      {label}
                    </span>
                    {entry && (
                      <span className="text-[11px] truncate text-light">
                        {identifierFor(entry)}
                      </span>
                    )}
                  </div>
                  {entry ? (
                    <CheckCircleIcon
                      sx={{ fontSize: 18 }}
                      className="shrink-0 text-tertiary"
                      titleAccess="Linked"
                    />
                  ) : (
                    <button
                      className="text-sm font-semibold shrink-0 text-primary"
                      onClick={() => {
                        if (id === "google.com") {
                          runLink("Google", () => linkGoogle(auth));
                        } else {
                          setExpanded(expanded === id ? null : id);
                          setPhoneConfirm(null);
                        }
                      }}
                      disabled={busy}
                    >
                      Link
                    </button>
                  )}
                </div>

                {expanded === "password" && id === "password" && !entry && (
                  <div className="flex flex-col gap-2 pt-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      autoComplete="email"
                      className="w-full input-primary"
                    />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="New password"
                      autoComplete="new-password"
                      className="w-full input-primary"
                    />
                    <button
                      className="py-2 text-sm font-semibold text-white rounded-full bg-primary disabled:opacity-50"
                      disabled={busy || !email || !password}
                      onClick={() =>
                        runLink("Email & password", () =>
                          linkEmailPassword(auth, email, password)
                        )
                      }
                    >
                      {busy ? "Linking..." : "Link email & password"}
                    </button>
                  </div>
                )}

                {expanded === "phone" && id === "phone" && !entry && (
                  <div className="flex flex-col gap-2 pt-2">
                    {!phoneConfirm ? (
                      <>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 555 555 5555"
                          autoComplete="tel"
                          className="w-full input-primary"
                        />
                        <button
                          id="link-phone-send"
                          className="py-2 text-sm font-semibold text-white rounded-full bg-primary disabled:opacity-50"
                          disabled={busy || !phone.trim()}
                          onClick={async () => {
                            if (busy) return;
                            setBusy(true);
                            try {
                              setPhoneConfirm(
                                await startPhoneLink(
                                  auth,
                                  phone.trim(),
                                  "link-phone-send"
                                )
                              );
                            } catch (error) {
                              showNotification(error.message);
                            } finally {
                              setBusy(false);
                            }
                          }}
                        >
                          {busy ? "Sending..." : "Text me a code"}
                        </button>
                      </>
                    ) : (
                      <>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          placeholder="6-digit code"
                          className="w-full input-primary"
                        />
                        <button
                          className="py-2 text-sm font-semibold text-white rounded-full bg-primary disabled:opacity-50"
                          disabled={busy || code.trim().length < 6}
                          onClick={() =>
                            runLink("Phone", () =>
                              phoneConfirm.confirm(code.trim())
                            )
                          }
                        >
                          {busy ? "Linking..." : "Confirm code"}
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-3 bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center gap-2">
          <HistoryIcon sx={{ fontSize: 18 }} className="shrink-0 text-light" />
          <div>
            <h4 className="text-sm font-semibold">Link a previous account</h4>
            <p className="text-[11px] text-light">
              Played in years past under a different login? Sign into it once
              and its history moves here.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1.5 mt-2">
          {[
            ["email", "Email"],
            ["phone", "Phone"],
            ["google", "Google"],
          ].map(([key, label]) => (
            <button
              key={key}
              className={`py-1.5 text-xs font-semibold border rounded-lg ${
                mergeMethod === key
                  ? "border-primary text-primary bg-primary/5"
                  : "border-gray-200 text-light bg-white"
              }`}
              onClick={() => {
                setMergeMethod(mergeMethod === key ? null : key);
                setMergeProof(null);
              }}
              disabled={busy}
            >
              {label}
            </button>
          ))}
        </div>

        {mergeMethod === "email" && (
          <div className="flex flex-col gap-2 pt-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Old account's email"
              className="w-full input-primary"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Its password"
              className="w-full input-primary"
            />
            <button
              className="py-2 text-sm font-semibold text-white rounded-full bg-primary disabled:opacity-50"
              disabled={busy || !email || !password}
              onClick={() =>
                runMerge(() => priorAccountTokenWithEmail(email, password))
              }
            >
              {busy ? "Merging..." : "Verify & merge"}
            </button>
          </div>
        )}

        {mergeMethod === "google" && (
          <button
            className="w-full py-2 mt-2 text-sm font-semibold text-white rounded-full bg-primary disabled:opacity-50"
            disabled={busy}
            onClick={() => runMerge(priorAccountTokenWithGoogle)}
          >
            {busy ? "Merging..." : "Sign in with Google & merge"}
          </button>
        )}

        {mergeMethod === "phone" && (
          <div className="flex flex-col gap-2 pt-2">
            {!mergeProof ? (
              <>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Old account's phone (+1...)"
                  className="w-full input-primary"
                />
                <button
                  id="merge-phone-send"
                  className="py-2 text-sm font-semibold text-white rounded-full bg-primary disabled:opacity-50"
                  disabled={busy || !phone.trim()}
                  onClick={async () => {
                    if (busy) return;
                    setBusy(true);
                    try {
                      setMergeProof(
                        await startPriorAccountPhoneProof(
                          phone.trim(),
                          "merge-phone-send"
                        )
                      );
                    } catch (error) {
                      showNotification(error.message);
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  {busy ? "Sending..." : "Text me a code"}
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  inputMode="numeric"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="6-digit code"
                  className="w-full input-primary"
                />
                <button
                  className="py-2 text-sm font-semibold text-white rounded-full bg-primary disabled:opacity-50"
                  disabled={busy || code.trim().length < 6}
                  onClick={() => runMerge(() => mergeProof.confirm(code.trim()))}
                >
                  {busy ? "Merging..." : "Confirm & merge"}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AuthMethods;

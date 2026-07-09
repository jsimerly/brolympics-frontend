import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Img from "../Util/Img";
import RingStrip from "../Util/RingStrip";
import { useNotification } from "../Util/Notification";
import { SkeletonBlock } from "../Util/Skeleton";

/**
 * Shared invite landing. fetchInfo returns the unified invite preview
 * ({kind, uuid, name, league_name, img, detail}); fetchJoin returns a
 * navigation payload ({brolympics?, league?, welcome_message?}).
 */
const InviteLanding = ({ fetchInfo, fetchJoin, joinText, kind }) => {
  const { uuid } = useParams();
  const [info, setInfo] = useState();
  const [joining, setJoining] = useState(false);
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const getInfo = async () => {
      try {
        setInfo(await fetchInfo(uuid));
      } catch (error) {
        if (error.response?.status === 404) {
          showNotification(
            "We couldn't find this invite — rerouting you home.",
            "error"
          );
          setTimeout(() => navigate("/"), 3000);
        } else {
          showNotification("There was an error loading this invite.", "error");
        }
      }
    };
    getInfo();
  }, [uuid, fetchInfo, showNotification, navigate]);

  const joinClick = async () => {
    if (joining) return;
    setJoining(true);
    try {
      const data = await fetchJoin(uuid);
      showNotification(data?.welcome_message ?? "Welcome!", "success");
      if (data?.brolympics) {
        navigate(`/b/${data.brolympics}/home`);
      } else if (data?.league) {
        navigate(`/league/${data.league}`);
      } else {
        navigate("/");
      }
    } catch (error) {
      setJoining(false);
      if (error.response?.status === 403) {
        showNotification(
          error.response.data?.detail ?? "Registration is closed.",
          "warning"
        );
      } else {
        showNotification("There was an error accepting this invite.", "error");
      }
    }
  };

  return (
    <div className="flex items-center justify-center p-4 h-screen-minus-nav">
      <div className="w-full max-w-md">
        <div className="p-6 text-center bg-white border border-gray-200 rounded-lg shadow-sm">
          {info ? (
            <>
              <p className="text-xs font-semibold tracking-wide uppercase text-light">
                You're invited
              </p>
              <Img
                src={info.img}
                alt={info.name}
                kind={kind}
                className="object-cover w-24 h-24 mx-auto mt-4 rounded-xl"
              />
              <h1 className="pt-3 text-2xl font-bold leading-tight">
                {info.name}
              </h1>
              {info.league_name && info.league_name !== info.name && (
                <p className="text-sm text-light">{info.league_name}</p>
              )}
              {info.detail && info.detail !== info.league_name && (
                <p className="pt-1 text-sm text-light">{info.detail}</p>
              )}
              <RingStrip className="w-20 mx-auto mt-4" />
              <button
                className="w-full py-3 mt-6 font-semibold text-white rounded-full bg-primary disabled:opacity-50"
                onClick={joinClick}
                disabled={joining}
              >
                {joining ? "Joining..." : joinText}
              </button>
              <button
                className="pt-3 text-sm font-semibold text-light"
                onClick={() => navigate("/")}
              >
                Not now
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 py-6">
              <SkeletonBlock className="w-24 h-24 rounded-xl" />
              <SkeletonBlock className="w-40 h-6 rounded" />
              <SkeletonBlock className="w-full rounded-full h-11" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InviteLanding;

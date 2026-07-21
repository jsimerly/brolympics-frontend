import useClickOutside from "../../hooks/useClickOutside";

/** The confirm dialog: one decision, two pill buttons. `danger` (the default)
 * paints the continue action red — pass danger={false} for positive confirms
 * like starting the games. */
const PopupContinue = ({
  open,
  setOpen,
  header,
  desc,
  continueText,
  continueFunc,
  danger = true,
}) => {
  const close = () => setOpen(false);
  const continueClicked = () => {
    setOpen(false);
    continueFunc();
  };

  const node = useClickOutside(close);

  return (
    open && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50">
        <div className="w-full max-w-sm p-5 bg-white rounded-lg shadow-xl" ref={node}>
          <h2 className="text-lg font-bold">{header}</h2>
          <p className="pt-1.5 pb-5 text-sm text-light">{desc}</p>
          <div className="flex gap-2">
            <button
              className="w-1/2 py-2.5 text-sm font-semibold border border-gray-300 rounded-full text-light"
              onClick={close}
            >
              Cancel
            </button>
            <button
              className={`w-1/2 py-2.5 text-sm font-semibold text-white rounded-full ${
                danger ? "bg-red" : "bg-primary"
              }`}
              onClick={continueClicked}
            >
              {continueText}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default PopupContinue;

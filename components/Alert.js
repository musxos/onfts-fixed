export default function Alert({
  children,
  altertProps = {
    className: "",
  },
}) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 10,
        right: 10,
      }}
    >
      <div className={`alert alert-round ${altertProps.className}`}>
        {children}
      </div>
    </div>
  );
}

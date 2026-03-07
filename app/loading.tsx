export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-50">
      <div className="relative flex items-center justify-center w-10 h-10">
        {/* Outer ring */}
        <span
          className="absolute inline-block w-10 h-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin"
          style={{ animationDuration: "0.75s" }}
        />
        {/* Inner dot */}
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
      </div>
    </div>
  );
}

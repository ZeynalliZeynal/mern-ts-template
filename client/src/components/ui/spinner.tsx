import { clsx } from "clsx";

const Spinner = ({ size = "sm" }: { size?: "sm" | "md" }) => {
  return (
    <div
      className={clsx("relative", {
        "size-5": size === "sm",
        "size-8": size === "md",
      })}
    >
      <div className="size-full absolute top-1/2 left-1/2">
        <div
          className="h-[8%] w-[24%] absolute -left-[10%] -top-[3.9%] rounded-md bg-gray-700 animate-spinner"
          style={{
            transform: "rotate(0.0001deg) translate(146%)",
            animationDelay: "-1.2s",
          }}
        />
        <div
          className="h-[8%] w-[24%] absolute -left-[10%] -top-[3.9%] rounded-md bg-gray-700 animate-spinner"
          style={{
            transform: "rotate(30deg) translate(146%)",
            animationDelay: "-.1.1s",
          }}
        />
        <div
          className="h-[8%] w-[24%] absolute -left-[10%] -top-[3.9%] rounded-md bg-gray-700 animate-spinner"
          style={{
            transform: "rotate(60deg) translate(146%)",
            animationDelay: "-1s",
          }}
        />
        <div
          className="h-[8%] w-[24%] absolute -left-[10%] -top-[3.9%] rounded-md bg-gray-700 animate-spinner"
          style={{
            transform: "rotate(90deg) translate(146%)",
            animationDelay: "-.9s",
          }}
        />
        <div
          className="h-[8%] w-[24%] absolute -left-[10%] -top-[3.9%] rounded-md bg-gray-700 animate-spinner"
          style={{
            transform: "rotate(120deg) translate(146%)",
            animationDelay: "-.8s",
          }}
        />
        <div
          className="h-[8%] w-[24%] absolute -left-[10%] -top-[3.9%] rounded-md bg-gray-700 animate-spinner"
          style={{
            transform: "rotate(150deg) translate(146%)",
            animationDelay: "-.7s",
          }}
        />
        <div
          className="h-[8%] w-[24%] absolute -left-[10%] -top-[3.9%] rounded-md bg-gray-700 animate-spinner"
          style={{
            transform: "rotate(180deg) translate(146%)",
            animationDelay: "-.6s",
          }}
        />
        <div
          className="h-[8%] w-[24%] absolute -left-[10%] -top-[3.9%] rounded-md bg-gray-700 animate-spinner"
          style={{
            transform: "rotate(210deg) translate(146%)",
            animationDelay: "-.5s",
          }}
        />
        <div
          className="h-[8%] w-[24%] absolute -left-[10%] -top-[3.9%] rounded-md bg-gray-700 animate-spinner"
          style={{
            transform: "rotate(240deg) translate(146%)",
            animationDelay: "-.4s",
          }}
        />
        <div
          className="h-[8%] w-[24%] absolute -left-[10%] -top-[3.9%] rounded-md bg-gray-700 animate-spinner"
          style={{
            transform: "rotate(270deg) translate(146%)",
            animationDelay: "-.3s",
          }}
        />
        <div
          className="h-[8%] w-[24%] absolute -left-[10%] -top-[3.9%] rounded-md bg-gray-700 animate-spinner"
          style={{
            transform: "rotate(300deg) translate(146%)",
            animationDelay: "-.2s",
          }}
        />
        <div
          className="h-[8%] w-[24%] absolute -left-[10%] -top-[3.9%] rounded-md bg-gray-700 animate-spinner"
          style={{
            transform: "rotate(330deg) translate(146%)",
            animationDelay: "-.1s",
          }}
        />
      </div>
    </div>
  );
};

export default Spinner;

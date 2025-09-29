interface MessageProps {
  type?: "success" | "error" | "info" | "warning"; // message type
  text: string;
  className?: string;
}

export const Message = ({
  type = "info",
  text,
  className = "",
}: MessageProps) => {
  let baseStyle = "p-4 rounded-md mb-4 text-sm font-medium";

  let typeStyle = "";
  switch (type) {
    case "success":
      typeStyle = "bg-green-100 text-green-800";
      break;
    case "error":
      typeStyle = "bg-red-100 text-red-800";
      break;
    case "info":
      typeStyle = "bg-blue-100 text-blue-800";
      break;
    case "warning":
      typeStyle = "bg-yellow-100 text-yellow-800";
      break;
  }

  return <div className={`${baseStyle} ${typeStyle} ${className}`}>{text}</div>;
};

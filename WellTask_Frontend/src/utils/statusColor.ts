export const getColorByStatus = (status: string): string => {
  switch (status.toLowerCase()) {
    case "todo":
      return "#FFE5E5";
    case "in progress":
      return "#FFF8E5";
    case "done":
      return "#E5FFED";
    default:
      return "#F3F4F6";
  }
};

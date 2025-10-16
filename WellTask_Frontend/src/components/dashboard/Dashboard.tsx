import { WelcomeBanner } from "./overview/WelcomeBanner";
import { QuickStart } from "./overview/QuickStart";

export default function Dashboard() {
  return (
    <>
      <WelcomeBanner />
      <QuickStart />
    </>
  );
}

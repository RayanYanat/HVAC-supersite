import AmbientCanvas  from "@/components/shared/AmbientCanvas";
import GlobalTexture  from "@/components/shared/GlobalTexture";
import CustomCursor   from "@/components/shared/CustomCursor";
import GSAPConfig     from "@/components/shared/GSAPConfig";
import LockedScreen   from "@/components/shared/LockedScreen";

/**
 * Root route — shown when a visitor navigates to the bare domain
 * without a personalized slug (e.g. after removing the slug from the URL).
 *
 * Does NOT redirect to the demo slug — that would expose the template
 * and break the personalization illusion for every other lead.
 */
export default function Home() {
  return (
    <>
      <AmbientCanvas />
      <GlobalTexture />
      <CustomCursor />
      <GSAPConfig />
      <LockedScreen />
    </>
  );
}

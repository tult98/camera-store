import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from '@medusajs/framework/workflows-sdk';
import { BANNER_MODULE } from 'src/modules/banner';
import BannerModuleService from 'src/modules/banner/service';

export type CreateBannerStepInput = {
  images: string[];
  is_active: boolean;
};

type BannerData = {
  id: string;
  images: Record<string, unknown>;
  is_active: boolean;
};

type PreviousBannerState = {
  existed: boolean;
  previousData?: BannerData;
};

export const getExistingBannerStep = createStep(
  'get-existing-banner-step',
  async (_input: void, { container }) => {
    const bannerModuleService: BannerModuleService =
      container.resolve(BANNER_MODULE);

    const [banners] = await bannerModuleService.listAndCountBanners({}, { take: 1 });

    return new StepResponse(banners[0] || null);
  }
);

export const updateOrCreateBannerStep = createStep(
  'update-or-create-banner-step',
  async (
    input: { bannerInput: CreateBannerStepInput; existingBanner: BannerData | null },
    { container }
  ) => {
    const bannerModuleService: BannerModuleService =
      container.resolve(BANNER_MODULE);

    if (input.existingBanner) {
      const updated = await bannerModuleService.updateBanners({
        id: input.existingBanner.id,
        images: input.bannerInput.images as unknown as Record<string, unknown>,
        is_active: input.bannerInput.is_active,
      });

      return new StepResponse(updated, {
        existed: true,
        previousData: input.existingBanner,
      } as PreviousBannerState);
    } else {
      const created = await bannerModuleService.createBanners({
        images: input.bannerInput.images as unknown as Record<string, unknown>,
        is_active: input.bannerInput.is_active,
      });

      return new StepResponse(created, {
        existed: false,
      } as PreviousBannerState);
    }
  },
  async (previousState: PreviousBannerState | undefined, { container }) => {
    if (!previousState) return;

    const bannerModuleService: BannerModuleService =
      container.resolve(BANNER_MODULE);

    if (previousState.existed && previousState.previousData) {
      await bannerModuleService.updateBanners({
        id: previousState.previousData.id,
        images: previousState.previousData.images,
        is_active: previousState.previousData.is_active,
      });
    } else {
      const [banners] = await bannerModuleService.listAndCountBanners({}, { take: 1 });
      if (banners[0]) {
        await bannerModuleService.deleteBanners(banners[0].id);
      }
    }
  }
);

export const createBannerWorkflow = createWorkflow(
  'create-banner',
  (input: CreateBannerStepInput) => {
    const existingBanner = getExistingBannerStep();
    const banner = updateOrCreateBannerStep({
      bannerInput: input,
      existingBanner
    });

    return new WorkflowResponse(banner);
  }
);

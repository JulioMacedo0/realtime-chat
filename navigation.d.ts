import { CameraCapturedPicture } from "expo-camera";

export interface Screens {
  home: undefined;
  cameraSnedPhoto: CameraCapturedPicture;
}

export declare global {
  namespace ReactNavigation {
    interface RootParamList extends Screens {}
  }
}

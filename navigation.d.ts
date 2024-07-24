import { CameraCapturedPicture } from "expo-camera";

export interface Screens {
  home: undefined;
  cameraSendPhoto: CameraCapturedPicture;
  camera: undefined;
}

export declare global {
  namespace ReactNavigation {
    interface RootParamList extends Screens {}
  }
}

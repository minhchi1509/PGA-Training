import { ErrorToast, SuccessToast } from '@src/components/Toast/Toast';

interface IToastConfigItem {
  props: {
    message: string;
  };
}

const toastConfig = {
  success: ({ props }: IToastConfigItem) => <SuccessToast message={props.message} />,
  error: ({ props }: IToastConfigItem) => <ErrorToast message={props.message} />,
};

export default toastConfig;

import { Spin } from 'antd';

import './LoadingScreen.scss';

interface ILoadingScreenProps {
  isShowTip?: boolean;
}

const LoadingScreen = ({ isShowTip }: ILoadingScreenProps) => {
  return (
    <div className="LoadingScreen">
      <Spin tip={isShowTip ? 'Loading' : ''} />
    </div>
  );
};

export default LoadingScreen;

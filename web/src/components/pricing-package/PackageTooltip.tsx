import { Tooltip, TooltipProps } from 'antd';
import { InfoGreyIcon } from 'src/assets/icons';
import './PackageTooltip.scss';

const PackageTooltip = ({ className }: TooltipProps) => {
  return (
    <Tooltip
      title="Please contact us for pricing if your clinic manages 17 or more practitioners"
      className={`PackageTooltip ${className ?? ''}`}
      color="#485993"
      placement="right"
    >
      <InfoGreyIcon />
    </Tooltip>
  );
};

export default PackageTooltip;

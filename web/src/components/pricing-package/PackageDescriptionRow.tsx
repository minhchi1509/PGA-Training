import { CheckIcon } from 'src/assets/icons';
import { BaseText } from '../typography';
import './PackageDescriptionRow.scss';
import React from 'react';

interface IPackageDescriptionRowProps {
  text: string;
  icon?: React.ReactNode;
}

const PackageDescriptionRow = ({ text, icon }: IPackageDescriptionRowProps) => {
  return (
    <div className="package-description-row">
      <div>{icon ? icon : <CheckIcon />}</div>
      <BaseText type="caption">{text}</BaseText>
    </div>
  );
};

export default PackageDescriptionRow;

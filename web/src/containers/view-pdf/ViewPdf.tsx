import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import type { PDFDocumentProxy } from 'pdfjs-dist';

import './ViewPdf.scss';
import { Space } from 'antd';
import { AntsaLogo, FullAntsaLogo } from 'src/assets/icons';
import { RoutePaths } from 'src/routes/routes-constants';
import { BaseText } from 'src/components/typography';

const url = `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = url;

const options = {
  cMapUrl: 'cmaps/',
  standardFontDataUrl: 'standard_fonts/',
};

interface IViewPdfProps {
  url: string;
  title: string;
  isSmallPage?: boolean;
  removeHeader?: boolean;
}

export default function ViewPdf({ url, title, removeHeader, isSmallPage }: IViewPdfProps) {
  const navigate = useNavigate();
  const [numPages, setNumPages] = useState<number>();

  const onDocumentLoadSuccess = ({ numPages: nextNumPages }: PDFDocumentProxy) => {
    setNumPages(nextNumPages);
  };

  return (
    <div className="ViewPDfPage">
      {!removeHeader ? (
        <header className="ViewPdfPage__header">
          <Space className="ViewPdfPage__header-logo" onClick={() => navigate(RoutePaths.HOME)}>
            <AntsaLogo height={48} width={48} />
            <FullAntsaLogo height={36} />
          </Space>
          <BaseText className="ViewPdfPage__title" type="body2">
            {title}
          </BaseText>
        </header>
      ) : null}

      <div className={`ViewPDfPage__container ${isSmallPage ? 'small-page' : ''}`}>
        <div className="ViewPDfPage__container__document">
          <Document file={url} onLoadSuccess={onDocumentLoadSuccess} options={options}>
            {Array.from(new Array(numPages), (el, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} width={1000} />
            ))}
          </Document>
        </div>
      </div>
    </div>
  );
}

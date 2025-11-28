import { useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './Report.module.css';

interface Supplier {
  label: string;
  price: number;
  delivery_price: number | null;
}

interface TenderAnalysis {
  tender_id: string;
  price: number;
  tax_percent: number | null;
  suppliers: Supplier[];
}

interface ReportProps {
  toolInput: {
    content: string;
    tenders?: TenderAnalysis[] | null;
  };
}

export const Report = ({ toolInput }: ReportProps) => {
  const [open, setOpen] = useState(false);
  const tenders = toolInput.tenders || [];
  const analysisRef = useRef<HTMLDivElement | null>(null);
  const reportRef = useRef<HTMLDivElement | null>(null);

  const calculateMargin = (tender: TenderAnalysis, supplier: Supplier) => {
    const tax = tender.tax_percent ? tender.price * tender.tax_percent : 0;
    const delivery = supplier.delivery_price || 0;
    return tender.price - tax - delivery - supplier.price;
  };

  const handleDownload = async () => {
    if (!reportRef.current) return;
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const opt = {
        margin: 0.5,
        filename: 'report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      };
      html2pdf().from(reportRef.current).set(opt).save();
    } catch (err) {
      console.error('Failed to download report', err);
    }
  };

  const charts = useMemo(() => {
    return tenders.map((tender) => {
      const priceMax = Math.max(...tender.suppliers.map((s) => s.price), 0.0001);
      const margins = tender.suppliers.map((s) => calculateMargin(tender, s));
      const marginMax = Math.max(...margins.map((m) => Math.abs(m)), 0.0001);
      const taxAmount = tender.tax_percent ? tender.price * tender.tax_percent : 0;

      return {
        id: tender.tender_id,
        priceMax,
        marginMax,
        suppliers: tender.suppliers.map((s, idx) => ({
          ...s,
          margin: margins[idx],
        })),
        tenderPrice: tender.price,
        taxAmount,
        taxPercent: tender.tax_percent,
      };
    });
  }, [tenders]);

  return (
    <>
      <div className={styles.card}>
        <div className={styles.title}>Сформировал отчет</div>
        <button className={styles.openButton} onClick={() => setOpen(true)}>
          Открыть
        </button>
      </div>

      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()} ref={reportRef}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>Отчет</div>
              <button className={styles.close} onClick={() => setOpen(false)}>
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.markdown}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {toolInput.content || ''}
                </ReactMarkdown>
              </div>

              {charts.length > 0 &&
                charts.map((chart, idx) => (
                  <div
                    key={chart.id}
                    className={styles.tenderBlock}
                    ref={idx === 0 ? analysisRef : undefined}
                  >
                    <div className={styles.tenderHeader}>
                      <div className={styles.tenderTitle}>Тендер</div>
                      <div className={styles.tenderPrice}>
                        Цена: {chart.tenderPrice.toLocaleString('ru-RU')}
                        {chart.taxPercent !== null && (
                          <> • Налог {chart.taxAmount.toLocaleString('ru-RU')} ({(chart.taxPercent * 100).toFixed(1)}%)</>
                        )}
                      </div>
                    </div>

                    <div className={styles.chartBlock}>
                      <div className={styles.chartTitle}>Цены поставщиков</div>
                      <div className={styles.bars}>
                        {chart.suppliers.map((supplier) => (
                          <div key={supplier.label} className={styles.barRow}>
                            <div className={styles.barLabel}>{supplier.label}</div>
                            <div className={styles.barTrack}>
                              <div
                    className={styles.barFill}
                                style={{ width: `${(supplier.price / chart.priceMax) * 100}%` }}
                              />
                            </div>
                            <div className={styles.barValue}>
                              {supplier.price.toLocaleString('ru-RU')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={styles.chartBlock}>
                      <div className={styles.chartTitle}>Маржа по поставщикам</div>
                      <div className={styles.bars}>
                        {chart.suppliers.map((supplier) => (
                          <div key={supplier.label + '-margin'} className={styles.barRow}>
                            <div className={styles.barLabel}>{supplier.label}</div>
                            <div className={styles.barTrack}>
                              <div
                                className={styles.barFill}
                                style={{
                                  width: `${(Math.abs(supplier.margin) / chart.marginMax) * 100}%`,
                                  background:
                                    supplier.margin >= 0
                                      ? 'linear-gradient(90deg, #16a34a, #22c55e)'
                                      : 'linear-gradient(90deg, #dc2626, #ef4444)',
                                }}
                              />
                            </div>
                            <div className={styles.barValue}>
                              {Math.round(supplier.margin).toLocaleString('ru-RU')}
                            </div>
                          </div>
                        ))}
                      </div>
                      {chart.suppliers.map((supplier) => {
                        const delivery = supplier.delivery_price || 0;
                        return (
                          <div key={supplier.label + '-meta'} className={styles.calcMeta}>
                            {supplier.label}: доставка {delivery.toLocaleString('ru-RU')}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
            </div>
            {tenders.length > 0 && (
              <>
                <button
                  className={styles.floatingButtonLeft}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload();
                  }}
                >
                  Скачать отчет ↓
                </button>
                <button
                  className={styles.floatingButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    analysisRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Перейти к анализу ↓
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

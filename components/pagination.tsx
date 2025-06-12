import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import { cn } from "./../lib/utils";
import Combobox from "./combobox";
import { OptionsProps } from "./selectbox";
import { useEffect, useState } from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showNumbers?: boolean;
  className?: string;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showNumbers = true,
  className = "",
}: PaginationProps) {
  const [currentPageLocal, setCurrentPageLocal] = useState<OptionsProps>({
    text: currentPage.toString(),
    value: currentPage,
  });

  const currentPageNumber = currentPage;
  const comboboxPagesNumber = totalPages - 3;

  const handlePrevious = () => {
    if (currentPageNumber > 1) {
      const newValue = currentPage - 1;
      onPageChange(newValue);
      if (currentPage < 49) {
        setCurrentPageLocal({ value: newValue, text: newValue.toString() });
      }
    }
  };

  const handleNext = () => {
    if (currentPageNumber < totalPages) {
      const newValue = currentPage + 1;
      onPageChange(newValue);
      if (currentPage < comboboxPagesNumber) {
        setCurrentPageLocal({ value: newValue, text: newValue.toString() });
      }
    }
  };

  return (
    <div className={cn("flex flex-row items-center gap-2", className)}>
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        aria-label="Previous Page"
        className="w-[38px] h-[38px] flex justify-center items-center rounded-xs disabled:cursor-default border border-gray-100 disabled:hover:bg-transparent hover:bg-blue-100 focus:outline-none cursor-pointer disabled:opacity-50"
      >
        <RiArrowLeftSLine size={20} />
      </button>

      {showNumbers && (
        <PaginationItem
          currentPage={currentPage}
          currentPageLocal={currentPageLocal}
          onPageChange={onPageChange}
          totalPages={totalPages}
          setCurrentPageLocal={setCurrentPageLocal}
        />
      )}

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="Next Page"
        className="w-[38px] h-[38px] flex justify-center items-center rounded-xs disabled:cursor-default border border-gray-100 disabled:hover:bg-transparent hover:bg-blue-100 focus:outline-none cursor-pointer disabled:opacity-50"
      >
        <RiArrowRightSLine size={20} />
      </button>
    </div>
  );
}

const PaginationItem = ({
  totalPages,
  currentPage,
  currentPageLocal,
  onPageChange,
  setCurrentPageLocal,
}: {
  totalPages: number;
  currentPage: number;
  currentPageLocal: OptionsProps;
  onPageChange: (page: number) => void;
  setCurrentPageLocal: (page: OptionsProps) => void;
}) => {
  const [highlightOnMatch, setHighlightOnMatch] = useState(false);

  const comboboxPagesNumber = totalPages - 3;

  useEffect(() => {
    if (currentPage > comboboxPagesNumber) {
      setHighlightOnMatch(false);
    } else {
      setHighlightOnMatch(true);
    }
  }, [currentPage, comboboxPagesNumber]);

  const threshold = 5;

  const lastPages =
    totalPages > threshold
      ? Array.from({ length: 3 }, (_, i) => totalPages - 2 + i)
      : [];

  const comboBoxPages =
    totalPages > threshold
      ? Array.from({ length: totalPages - 3 }, (_, i) => i + 1)
      : [];

  const allPages =
    totalPages <= threshold
      ? Array.from({ length: totalPages }, (_, i) => i + 1)
      : [];

  const formatOption = (page: string | number) => ({
    value: page,
    text: page.toString(),
  });

  return (
    <div className="flex flex-row py-10 items-center gap-2">
      {totalPages > threshold ? (
        <>
          <Combobox
            highlightOnMatch={highlightOnMatch}
            options={comboBoxPages.map(formatOption)}
            inputValue={currentPageLocal}
            setInputValue={(val) => {
              onPageChange(Number(val.value));
              setCurrentPageLocal(val);
            }}
            containerClassName="w-[80px] text-sm"
          />

          {lastPages.map((page) => {
            const isActive = currentPage === page;
            return (
              <button
                key={page}
                onClick={() => {
                  onPageChange(page);
                  if (Number(currentPageLocal.value) > comboboxPagesNumber) {
                    setCurrentPageLocal(formatOption(page));
                  }
                }}
                className={cn(
                  "w-[38px] h-[38px] rounded-xs cursor-pointer text-sm font-medium focus:outline-none border border-gray-100",
                  isActive
                    ? "bg-[#61A9F9] text-white"
                    : "hover:bg-blue-100 text-gray-700"
                )}
              >
                {page}
              </button>
            );
          })}
        </>
      ) : (
        <>
          {allPages.map((page) => {
            const isActive = currentPage === page;
            return (
              <button
                key={page}
                onClick={() => {
                  onPageChange(page);
                  setCurrentPageLocal(formatOption(page));
                }}
                className={cn(
                  "w-[38px] h-[38px] rounded-xs text-sm cursor-pointer font-medium focus:outline-none border border-gray-100",
                  isActive
                    ? "bg-[#61A9F9] text-white"
                    : "hover:bg-blue-100 text-gray-700"
                )}
              >
                {page}
              </button>
            );
          })}
        </>
      )}
    </div>
  );
};

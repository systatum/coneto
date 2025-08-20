import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import { Combobox } from "./combobox";
import { OptionsProps } from "./selectbox";
import { ReactNode, useEffect, useMemo, useState } from "react";
import styled, { css, CSSProp } from "styled-components";
import { clamp } from "./../lib/math";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showNumbers?: boolean;
  style?: CSSProp;
};

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showNumbers = true,
  style,
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

  useEffect(() => {
    const safePage = clamp(currentPage, 1, comboboxPagesNumber);
    setCurrentPageLocal({ value: safePage, text: safePage.toString() });
  }, []);

  return (
    <PaginationWrapper $style={style}>
      <PaginationButton
        onClick={handlePrevious}
        disabled={currentPage === 1}
        aria-label="previous-page"
      >
        <RiArrowLeftSLine size={20} />
      </PaginationButton>

      {showNumbers && (
        <PaginationItem
          currentPage={currentPage}
          currentPageLocal={currentPageLocal}
          onPageChange={onPageChange}
          totalPages={totalPages}
          setCurrentPageLocal={setCurrentPageLocal}
          comboboxPagesNumber={comboboxPagesNumber}
        />
      )}

      <PaginationButton
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="next-page"
      >
        <RiArrowRightSLine size={20} />
      </PaginationButton>
    </PaginationWrapper>
  );
}

const PaginationWrapper = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  ${({ $style }) => $style}
`;

const PaginationItem = ({
  totalPages,
  currentPage,
  currentPageLocal,
  onPageChange,
  setCurrentPageLocal,
  comboboxPagesNumber,
}: {
  totalPages: number;
  currentPage: number;
  currentPageLocal: OptionsProps;
  onPageChange: (page: number) => void;
  setCurrentPageLocal: (page: OptionsProps) => void;
  comboboxPagesNumber?: number;
}) => {
  const highlightOnMatch = useMemo(() => {
    return currentPage <= comboboxPagesNumber;
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
    <PaginationItemWrapper>
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
            placeholder="1"
            containerStyle={css`
              width: 80px;
              font-size: 14px;
            `}
          />

          {lastPages.map((page) => {
            const isActive = currentPage === page;
            return (
              <PaginationButton
                key={page}
                onClick={() => {
                  onPageChange(page);
                  if (Number(currentPageLocal.value) > comboboxPagesNumber) {
                    setCurrentPageLocal(formatOption(page));
                  }
                }}
                isActive={isActive}
              >
                {page}
              </PaginationButton>
            );
          })}
        </>
      ) : (
        <>
          {allPages.map((page) => {
            const isActive = currentPage === page;
            return (
              <PaginationButton
                key={page}
                onClick={() => {
                  onPageChange(page);
                  setCurrentPageLocal(formatOption(page));
                }}
                isActive={isActive}
              >
                {page}
              </PaginationButton>
            );
          })}
        </>
      )}
    </PaginationItemWrapper>
  );
};

const PaginationItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const PaginationButton = ({
  onClick,
  style,
  children,
  isActive,
  disabled,
  ...props
}: {
  onClick: () => void;
  style?: CSSProp;
  children: ReactNode;
  isActive?: boolean;
  disabled?: boolean;
}) => {
  return (
    <Button
      {...props}
      onClick={onClick}
      disabled={disabled}
      $style={style}
      $isActive={isActive}
    >
      {children}
    </Button>
  );
};

const Button = styled.button<{
  $isActive?: boolean;
  $style?: CSSProp;
}>`
  min-width: 39px;
  min-height: 39px;
  max-width: 39px;
  max-height: 39px;
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  border: 1px solid ${({ $isActive }) => ($isActive ? "#61A9F9" : "#f3f4f6")};
  color: ${({ $isActive }) => ($isActive ? "#000" : "#374151")};

  &:hover {
    border-color: #61a9f9;
  }

  &:disabled {
    cursor: default;
    opacity: 0.3;
    background-color: transparent;
    &:hover {
      border-color: ${({ $isActive }) => ($isActive ? "#61A9F9" : "#f3f4f6")};
    }
  }

  ${({ $style }) => $style}
`;

export { Pagination };

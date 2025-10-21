import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import { Combobox } from "./combobox";
import { ReactNode, useEffect, useMemo, useState } from "react";
import styled, { css, CSSProp } from "styled-components";
import { clamp } from "./../lib/math";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showNumbers?: boolean;
  style?: CSSProp;
  buttonStyle?: CSSProp;
  comboboxStyle?: CSSProp;
};

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showNumbers = true,
  style,
  buttonStyle,
  comboboxStyle,
}: PaginationProps) {
  const [currentPageLocal, setCurrentPageLocal] = useState<string[]>([]);

  const currentPageNumber = currentPage;
  const comboboxPagesNumber = totalPages - 3;

  const handlePrevious = () => {
    if (currentPageNumber > 1) {
      const newValue = currentPage - 1;
      onPageChange(newValue);
      if (currentPage < totalPages) {
        setCurrentPageLocal([String(newValue)]);
      }
    }
  };

  const handleNext = () => {
    if (currentPageNumber < totalPages) {
      const newValue = currentPage + 1;
      onPageChange(newValue);
      if (currentPage < comboboxPagesNumber) {
        setCurrentPageLocal([String(newValue)]);
      }
    }
  };

  useEffect(() => {
    const safePage = clamp(currentPage, 1, comboboxPagesNumber);
    setCurrentPageLocal([String(safePage)]);
  }, []);

  return (
    <PaginationWrapper $style={style}>
      <PaginationButton
        style={buttonStyle}
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        <RiArrowLeftSLine size={20} />
      </PaginationButton>

      {showNumbers && (
        <PaginationItem
          comboboxStyle={comboboxStyle}
          buttonStyle={buttonStyle}
          currentPage={currentPage}
          currentPageLocal={currentPageLocal}
          onPageChange={onPageChange}
          totalPages={totalPages}
          setCurrentPageLocal={setCurrentPageLocal}
          comboboxPagesNumber={comboboxPagesNumber}
        />
      )}

      <PaginationButton
        style={buttonStyle}
        onClick={handleNext}
        disabled={currentPage === totalPages}
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
  buttonStyle,
  comboboxStyle,
}: {
  totalPages: number;
  currentPage: number;
  currentPageLocal: string[];
  onPageChange: (page: number) => void;
  setCurrentPageLocal: (page: string[]) => void;
  comboboxPagesNumber?: number;
  buttonStyle?: CSSProp;
  comboboxStyle?: CSSProp;
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

  const formatOption = (page: string) => ({
    value: page,
    text: page,
  });

  return (
    <PaginationItemWrapper>
      {totalPages > threshold ? (
        <>
          <Combobox
            highlightOnMatch={highlightOnMatch}
            options={comboBoxPages.map((data) => formatOption(String(data)))}
            selectionOptions={currentPageLocal}
            setSelectionOptions={(val) => {
              onPageChange(Number(val[0]));
              setCurrentPageLocal(val);
            }}
            selectboxStyle={comboboxStyle}
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
                style={buttonStyle}
                key={page}
                onClick={() => {
                  onPageChange(page);
                  if (Number(currentPageLocal[0]) > comboboxPagesNumber) {
                    setCurrentPageLocal([String(page)]);
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
                style={buttonStyle}
                key={page}
                onClick={() => {
                  onPageChange(page);
                  setCurrentPageLocal([String(page)]);
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
      aria-label="pagination-button"
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
  background-color: white;
  border: 1px solid ${({ $isActive }) => ($isActive ? "#61A9F9" : "#f3f4f6")};
  color: ${({ $isActive }) => ($isActive ? "#000" : "#374151")};

  &:hover {
    border-color: #61a9f9;
  }

  &:disabled {
    cursor: default;
    opacity: 0.3;
    background-color: white;
    &:hover {
      border-color: ${({ $isActive }) => ($isActive ? "#61A9F9" : "#f3f4f6")};
    }
  }

  ${({ $style }) => $style}
`;

export { Pagination };

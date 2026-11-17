'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useRouter } from 'next/navigation';
import { buildPageNumbers, cn, ELLIPSIS } from '@/lib/utils';

const CoinsPagination = ({ currentPage, totalPages, hasMorePages }: Pagination) => {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    router.push(`/coins?page=${page}`);
  };

  const pageNumbers = buildPageNumbers(currentPage, totalPages);
  const isLastPage = !hasMorePages || currentPage === totalPages;

  const controlClass = (disabled: boolean) =>
    disabled ? 'pointer-events-none opacity-50' : 'cursor-pointer';

  return (
    <Pagination>
      <PaginationContent className="flex w-full">
        <PaginationItem className="bg-dark-400 rounded-sm py-1 pr-2">
          <PaginationPrevious
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            className={controlClass(currentPage === 1)}
          />
        </PaginationItem>

        <div className="flex flex-1 justify-center gap-2">
          {pageNumbers.map((page, index) => (
            <PaginationItem key={index}>
              {page === ELLIPSIS ? (
                <span className="px-3 py-2 text-base">...</span>
              ) : (
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  className={cn('hover:bg-dark-400! rounded-sm text-base cursor-pointer', {
                    'bg-[#f3994f]! text-[#1a1a1a] font-semibold': currentPage === page,
                  })}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
        </div>

        <PaginationItem className="bg-dark-400 rounded-sm py-1 pl-2">
          <PaginationNext
            onClick={() => !isLastPage && handlePageChange(currentPage + 1)}
            className={controlClass(isLastPage)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CoinsPagination;


import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface DashboardPaginationProps {
  currentPage: number;
  hasMore: boolean;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export function DashboardPagination({
  currentPage,
  hasMore,
  totalPages,
  onPageChange,
  isLoading
}: DashboardPaginationProps) {
  // Don't render pagination if we only have one page or no data
  if (totalPages <= 1) return null;

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={`${currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}`}
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          />
        </PaginationItem>
        
        <PaginationItem>
          <PaginationLink isActive>{currentPage}</PaginationLink>
        </PaginationItem>
        
        {hasMore && (
          <>
            <PaginationItem>
              <PaginationLink onClick={handleLoadMore}>
                {currentPage + 1}
              </PaginationLink>
            </PaginationItem>
            
            {totalPages > currentPage + 1 && (
              <PaginationItem>
                <span className="flex h-9 w-9 items-center justify-center">...</span>
              </PaginationItem>
            )}
            
            {totalPages > currentPage + 1 && (
              <PaginationItem>
                <PaginationLink onClick={() => onPageChange(totalPages)}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}
          </>
        )}
        
        <PaginationItem>
          <PaginationNext
            className={`${!hasMore ? 'pointer-events-none opacity-50' : ''}`}
            onClick={handleLoadMore}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

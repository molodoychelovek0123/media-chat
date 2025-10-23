import React, { memo, useState, useCallback, useMemo } from 'react';
import { TableMessage as TableMessageType } from '@/types/chat';
import { Theme } from '@/types/theme';

interface TableMessageProps {
  message: TableMessageType;
  theme: Theme;
}

type SortDirection = 'asc' | 'desc' | null;
type SortState = {
  column: string | null;
  direction: SortDirection;
};

const TableMessage: React.FC<TableMessageProps> = memo(({ message, theme }) => {
  const [sortState, setSortState] = useState<SortState>({ column: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const itemsPerPage = 10;

  // Сортировка данных
  const sortedData = useMemo(() => {
    if (!sortState.column || !sortState.direction) {
      return message.data;
    }

    return [...message.data].sort((a, b) => {
      const aValue = a[sortState.column!];
      const bValue = b[sortState.column!];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortState.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const aString = String(aValue || '').toLowerCase();
      const bString = String(bValue || '').toLowerCase();

      if (sortState.direction === 'asc') {
        return aString.localeCompare(bString);
      } else {
        return bString.localeCompare(aString);
      }
    });
  }, [message.data, sortState]);

  // Фильтрация данных
  const filteredData = useMemo(() => {
    if (Object.keys(filters).length === 0) {
      return sortedData;
    }

    return sortedData.filter(row => {
      return Object.entries(filters).every(([columnKey, filterValue]) => {
        if (!filterValue) return true;
        
        const cellValue = String(row[columnKey] || '').toLowerCase();
        return cellValue.includes(filterValue.toLowerCase());
      });
    });
  }, [sortedData, filters]);

  // Пагинация
  const paginatedData = useMemo(() => {
    if (!message.pagination) {
      return filteredData;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, message.pagination]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSort = useCallback((columnKey: string) => {
    setSortState(prev => {
      if (prev.column !== columnKey) {
        return { column: columnKey, direction: 'asc' };
      }
      
      if (prev.direction === 'asc') {
        return { column: columnKey, direction: 'desc' };
      }
      
      return { column: null, direction: null };
    });
  }, []);

  const handleFilterChange = useCallback((columnKey: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [columnKey]: value
    }));
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const renderSortIcon = useCallback((columnKey: string) => {
    if (sortState.column !== columnKey) {
      return '↕️';
    }
    
    return sortState.direction === 'asc' ? '↑' : '↓';
  }, [sortState]);

  const formatCellValue = useCallback((value: any, columnKey?: string) => {
    if (value === null || value === undefined) {
      return '-';
    }

    if (typeof value === 'boolean') {
      return value ? '✓' : '✗';
    }

    if (typeof value === 'number') {
      // Форматирование валюты для финансовых столбцов
      if (columnKey?.includes('amount') || columnKey?.includes('price') || columnKey?.includes('cost')) {
        return new Intl.NumberFormat('ru-RU', {
          style: 'currency',
          currency: 'RUB',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value);
      }
      
      // Форматирование процентов
      if (columnKey?.includes('percent') || columnKey?.includes('rate') || columnKey?.includes('margin')) {
        return `${value}%`;
      }
      
      // Форматирование месяцев для окупаемости
      if (columnKey?.includes('month') || columnKey?.includes('окупаемость')) {
        return `${value} мес.`;
      }
      
      return new Intl.NumberFormat('ru-RU').format(value);
    }

    return String(value);
  }, []);

  return (
    <div className="table-message">
      {/* Заголовок таблицы */}
      {message.title && (
        <h3 
          className="text-lg font-semibold mb-3"
          style={{ color: theme.colors.text.primary }}
        >
          {message.title}
        </h3>
      )}

      {/* Таблица */}
      <div className="overflow-x-auto">
        <table 
          className="w-full border-collapse"
          style={{ borderColor: theme.colors.border }}
        >
          {/* Заголовки столбцов */}
          <thead>
            <tr style={{ backgroundColor: theme.colors.background }}>
              {message.columns.map(column => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-sm font-medium border-b"
                  style={{
                    color: theme.colors.text.primary,
                    borderColor: theme.colors.border,
                    width: column.width || 'auto'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.label}</span>
                    
                    {/* Иконка сортировки */}
                    {column.sortable && (
                      <button
                        onClick={() => handleSort(column.key)}
                        className="flex items-center justify-center w-6 h-6 rounded hover:opacity-70 transition-opacity"
                        style={{
                          backgroundColor: sortState.column === column.key 
                            ? theme.colors.primary 
                            : 'transparent',
                          color: sortState.column === column.key 
                            ? '#FFFFFF' 
                            : theme.colors.text.secondary
                        }}
                        aria-label={`Сортировать по ${column.label}`}
                      >
                        {renderSortIcon(column.key)}
                      </button>
                    )}
                  </div>

                  {/* Поле фильтрации */}
                  {column.filterable && (
                    <div className="mt-1">
                      <input
                        type="text"
                        placeholder="Фильтр..."
                        value={filters[column.key] || ''}
                        onChange={(e) => handleFilterChange(column.key, e.target.value)}
                        className="w-full px-2 py-1 text-xs rounded border"
                        style={{
                          backgroundColor: theme.colors.surface,
                          color: theme.colors.text.primary,
                          borderColor: theme.colors.border
                        }}
                      />
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          {/* Тело таблицы */}
          <tbody>
            {paginatedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:opacity-80 transition-opacity"
                style={{
                  backgroundColor: rowIndex % 2 === 0 
                    ? theme.colors.surface 
                    : theme.colors.background
                }}
              >
                {message.columns.map(column => (
                  <td
                    key={column.key}
                    className="px-4 py-3 text-sm border-b"
                    style={{
                      color: theme.colors.text.primary,
                      borderColor: theme.colors.border,
                      textAlign: column.align || 'left',
                      fontWeight: column.key.includes('total') || column.key.includes('итого') ? '600' : 'normal'
                    }}
                  >
                    {formatCellValue(row[column.key], column.key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Сообщение об отсутствии данных */}
        {paginatedData.length === 0 && (
          <div 
            className="text-center py-8"
            style={{ color: theme.colors.text.secondary }}
          >
            Нет данных для отображения
          </div>
        )}
      </div>

      {/* Пагинация */}
      {message.pagination && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div>
            <span 
              className="text-sm"
              style={{ color: theme.colors.text.secondary }}
            >
              Показано {paginatedData.length} из {filteredData.length} записей
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              style={{
                backgroundColor: theme.colors.background,
                color: theme.colors.text.primary
              }}
            >
              ←
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded text-sm transition-all ${
                  page === currentPage ? 'font-semibold' : ''
                }`}
                style={{
                  backgroundColor: page === currentPage 
                    ? theme.colors.primary 
                    : theme.colors.background,
                  color: page === currentPage 
                    ? '#FFFFFF' 
                    : theme.colors.text.primary
                }}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              style={{
                backgroundColor: theme.colors.background,
                color: theme.colors.text.primary
              }}
            >
              →
            </button>
          </div>
        </div>
      )}

      {/* Информация о таблице */}
      <div className="mt-3">
        <div
          className="flex items-center gap-2 text-xs px-2 py-1 rounded form-transition hover-lift"
          style={{
            backgroundColor: theme.colors.background,
            color: theme.colors.text.secondary
          }}
        >
          <span>📊</span>
          <span>
            {message.columns.length} столбц{message.columns.length === 1 ? 'а' : 'ов'}, {filteredData.length} строк{filteredData.length !== 1 ? 'и' : 'а'}
          </span>
          {(message.sortable || message.filterable) && (
            <>
              <span>•</span>
              <span>
                {message.sortable && 'Сортировка'}
                {message.sortable && message.filterable && ' и '}
                {message.filterable && 'Фильтрация'}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Дополнительная информация для финансовых таблиц */}
      {message.title?.toLowerCase().includes('финанс') && (
        <div className="mt-2">
          <div
            className="flex items-center gap-2 text-xs px-2 py-1 rounded"
            style={{
              backgroundColor: '#F0F9FF',
              color: '#0369A1',
              border: `1px solid #BAE6FD`
            }}
          >
            <span>💡</span>
            <span>
              Данные основаны на средних показателях рынка и могут отличаться в зависимости от конкретной локации
            </span>
          </div>
        </div>
      )}
    </div>
  );
});

TableMessage.displayName = 'TableMessage';

export default TableMessage;
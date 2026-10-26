"use client";

interface MonthMatrixProps {
  onSelectDay: (month: number, day: number) => void;
  selectedMonth?: number;
  selectedDay?: number;
  filledDays?: { month: number; day: number }[];
}

const MONTHS = [
  { num: 1, name: "Janeiro", days: 31 },
  { num: 2, name: "Fevereiro", days: 28 },
  { num: 3, name: "Março", days: 31 },
  { num: 4, name: "Abril", days: 30 },
  { num: 5, name: "Maio", days: 31 },
  { num: 6, name: "Junho", days: 30 },
  { num: 7, name: "Julho", days: 31 },
  { num: 8, name: "Agosto", days: 31 },
  { num: 9, name: "Setembro", days: 30 },
  { num: 10, name: "Outubro", days: 31 },
  { num: 11, name: "Novembro", days: 30 },
  { num: 12, name: "Dezembro", days: 31 },
];

export default function MonthMatrix({
  onSelectDay,
  selectedMonth,
  selectedDay,
  filledDays = [],
}: MonthMatrixProps) {
  const isFilled = (month: number, day: number) => {
    return filledDays.some((f) => f.month === month && f.day === day);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-6 max-w-4xl mx-auto my-4 select-none">
      {MONTHS.map((m) => {
        // Gera as semanas (grupos de 7 dias)
        const rows: number[][] = [];
        let current: number[] = [];
        for (let d = 1; d <= m.days; d++) {
          current.push(d);
          if (current.length === 7 || d === m.days) {
            rows.push(current);
            current = [];
          }
        }

        return (
          <div
            key={m.num}
            className="border-2 border-[#12589e] bg-white rounded-none shadow-sm overflow-hidden"
          >
            {/* Cabeçalho do Mês */}
            <div className="bg-[#12589e] text-white text-center font-bold py-1 text-sm tracking-wide">
              {m.name}
            </div>

            {/* Grade de Dias */}
            <table className="w-full text-center border-collapse text-xs">
              <tbody>
                {rows.map((row, rIdx) => (
                  <tr key={rIdx} className="border-t border-gray-300">
                    {row.map((day) => {
                      const isSelected =
                        selectedMonth === m.num && selectedDay === day;
                      const hasContent = isFilled(m.num, day);

                      return (
                        <td
                          key={day}
                          className="border-r border-gray-300 last:border-r-0 p-0"
                        >
                          <button
                            type="button"
                            onClick={() => onSelectDay(m.num, day)}
                            className={`w-full py-1.5 font-medium transition cursor-pointer hover:bg-yellow-100 ${
                              isSelected
                                ? "bg-red-600 text-white font-bold hover:bg-red-700"
                                : hasContent
                                ? "text-[#12589e] font-semibold bg-blue-50/50"
                                : "text-gray-800"
                            }`}
                            title={`${day} de ${m.name}`}
                          >
                            {day}
                          </button>
                        </td>
                      );
                    })}
                    {/* Preenchimento caso a última linha tenha menos de 7 dias */}
                    {row.length < 7 &&
                      Array.from({ length: 7 - row.length }).map((_, emptyIdx) => (
                        <td
                          key={`empty-${emptyIdx}`}
                          className="border-r border-gray-300 last:border-r-0 bg-gray-50"
                        />
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

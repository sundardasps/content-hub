
export default function ContentCardSkeleton() {
  return (
    <div className="rounded-2xl shadow-md p-4 animate-pulse bg-gray-100 dark:bg-gray-800 flex flex-col gap-3">
      <div className="w-full h-48 bg-gray-300 dark:bg-gray-700 rounded-lg" />
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full" />
      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-5/6" />
      <div className="flex justify-between mt-4">
        <div className="h-3 w-20 bg-gray-300 dark:bg-gray-600 rounded" />
        <div className="h-3 w-6 bg-gray-300 dark:bg-gray-600 rounded" />
      </div>
    </div>
  );
}

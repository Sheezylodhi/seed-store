export default function ProductDetailSkeleton() {
  return (
    <main className="min-h-screen bg-[#f8f6ef]">
      <div className="mx-auto max-w-[1380px] px-5 pb-24 pt-32 sm:px-8 lg:px-10">

        {/* Breadcrumb */}
        <div className="h-4 w-64 animate-pulse rounded bg-[#e7e3d8]" />

        <div className="mt-10 grid gap-12 lg:grid-cols-[1.06fr_0.94fr] lg:gap-20">

          {/* Product Gallery */}
          <div>
            <div className="aspect-square animate-pulse rounded-[32px] bg-[#e7e3d8]" />

            <div className="mt-4 grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="aspect-square animate-pulse rounded-2xl bg-[#e7e3d8]"
                />
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">

            {/* Category */}
            <div className="h-4 w-32 animate-pulse rounded bg-[#e7e3d8]" />

            {/* Product Title */}
            <div className="space-y-3">
              <div className="h-14 w-[85%] animate-pulse rounded bg-[#e7e3d8]" />
              <div className="h-14 w-[60%] animate-pulse rounded bg-[#e7e3d8]" />
            </div>

            {/* Rating */}
            <div className="h-5 w-56 animate-pulse rounded bg-[#e7e3d8]" />

            {/* Price */}
            <div className="h-10 w-40 animate-pulse rounded bg-[#e7e3d8]" />

            {/* Description */}
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-[#e7e3d8]" />
              <div className="h-4 w-[90%] animate-pulse rounded bg-[#e7e3d8]" />
              <div className="h-4 w-[78%] animate-pulse rounded bg-[#e7e3d8]" />
            </div>

            {/* Product Benefits */}
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse rounded-xl bg-[#e7e3d8]"
                />
              ))}
            </div>

            {/* Variants */}
            <div className="h-16 animate-pulse rounded-xl bg-[#e7e3d8]" />

            {/* Quantity + Cart */}
            <div className="h-14 animate-pulse rounded-xl bg-[#e7e3d8]" />

            {/* Trust Information */}
            <div className="h-20 animate-pulse rounded-2xl bg-[#e7e3d8]" />
          </div>
        </div>
      </div>
    </main>
  );
}
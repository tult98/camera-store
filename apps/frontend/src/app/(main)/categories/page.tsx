import Link from "next/link"

const categories = [
  {
    id: '1',
    name: 'Máy Ảnh',
    handle: 'may-anh',
    description: 'Máy ảnh chuyên nghiệp cho mọi nhu cầu và trình độ',
    image: '/categories/cameras.jpg',
    productCount: 156
  },
  {
    id: '2',
    name: 'Ống Kính',
    handle: 'ong-kinh',
    description: 'Ống kính chất lượng cao cho nhiếp ảnh tuyệt đẹp',
    image: '/categories/lenses.jpg',
    productCount: 89
  },
  {
    id: '3',
    name: 'Phụ Kiện',
    handle: 'phu-kien',
    description: 'Phụ kiện thiết yếu cho bộ thiết bị nhiếp ảnh',
    image: '/categories/accessories.jpg',
    productCount: 234
  }
]

export default function CategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Danh Mục Sản Phẩm</h1>
        <p className="text-lg text-base-content/70">
          Khám phá bộ sưu tập thiết bị nhiếp ảnh chuyên nghiệp
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.handle}`}
            className="group"
          >
            <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              {/* Category Image */}
              <div className="aspect-video bg-base-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 group-hover:from-primary/30 group-hover:to-primary/10 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl opacity-30">
                    {category.handle === 'may-anh' && '📷'}
                    {category.handle === 'ong-kinh' && '🔍'}
                    {category.handle === 'phu-kien' && '🎒'}
                  </div>
                </div>
              </div>

              {/* Category Info */}
              <div className="card-body">
                <h2 className="card-title text-xl group-hover:text-primary transition-colors">
                  {category.name}
                  <div className="badge badge-secondary">{category.productCount}</div>
                </h2>
                <p className="text-base-content/70 text-sm">
                  {category.description}
                </p>
                
                {/* Action */}
                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-primary btn-sm group-hover:btn-accent transition-colors">
                    Xem Sản Phẩm →
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-16 text-center">
        <div className="stats stats-vertical lg:stats-horizontal shadow">
          <div className="stat">
            <div className="stat-title">Tổng Sản Phẩm</div>
            <div className="stat-value text-primary">479</div>
            <div className="stat-desc">Các sản phẩm chất lượng cao</div>
          </div>
          
          <div className="stat">
            <div className="stat-title">Thương Hiệu</div>
            <div className="stat-value text-secondary">15+</div>
            <div className="stat-desc">Thương hiệu hàng đầu</div>
          </div>
          
          <div className="stat">
            <div className="stat-title">Danh Mục</div>
            <div className="stat-value text-accent">3</div>
            <div className="stat-desc">Danh mục chính</div>
          </div>
        </div>
      </div>
    </div>
  )
}
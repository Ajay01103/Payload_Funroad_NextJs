interface Props {
  params: Promise<{
    category: string
    subcategory: string
  }>
}

const SubCategoryPage = async ({ params }: Props) => {
  const { category, subcategory } = await params

  return (
    <div>
      CategoryPage {category} {subcategory}
    </div>
  )
}

export default SubCategoryPage

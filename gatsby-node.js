exports.createSchemaCustomization = ({ actions }) => {
    const { createTypes } = actions
    const typeDefs = `
        type menu_link_content__menu_link_content implements Node {
        drupal_parent_menu_item: String
        }
    `
    createTypes(typeDefs)
}

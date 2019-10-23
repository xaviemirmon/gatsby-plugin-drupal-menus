import React from "react"
import { StaticQuery, graphql, Link } from "gatsby"
import PropTypes from "prop-types";

function createMenuHierarchy(menuData, menuName) {
  let tree = [],
     mappedArr = {},
     arrElem,
     mappedElem

  // First map the nodes of the array to an object -> create a hash table.
  for (let i = 0, len = menuData.length; i < len; i++) {
    arrElem = menuData[i].node
    if (arrElem.menu_name === menuName && arrElem.enabled === true) {
      mappedArr[arrElem.drupal_id] = arrElem
      if (arrElem.drupal_parent_menu_item != null && arrElem.drupal_parent_menu_item.includes(arrElem.bundle)) {
        let stripped_drupal_id = arrElem.drupal_parent_menu_item.replace(arrElem.bundle + ':', '')
        mappedArr[arrElem.drupal_id].drupal_parent_menu_item = stripped_drupal_id
      }
      mappedArr[arrElem.drupal_id]['children'] = []
    }
  }

  for (let id in mappedArr) {
    if (mappedArr.hasOwnProperty(id)) {
      mappedElem = mappedArr[id]
      // If the element is not at the root level, add it to its parent array of children.
      if (mappedElem.drupal_parent_menu_item) {
        mappedArr[mappedElem.drupal_parent_menu_item]['children'].push(mappedElem)
      }
      // If the element is at the root level, add it to first level elements array.
      else {
        tree.push(mappedElem)
      }
    }
  }
  return tree
}

function buildLink(link) {
  if(!link.external && link.link.uri_alias) {
    return ( <Link to={link.link.uri_alias}>
      {link.title}
    </Link>)
  } else if(!link.external && link.link.uri.includes('internal:')) {
    return ( <Link to={link.link.uri.replace('internal:', '')}>
      {link.title}
    </Link>)
  } else {
    return ( <a href={link.link.uri_alias} className={'external'}>
      {link.title}
    </a>)
  }
}

function buildMenu(menuArray){
  if(!menuArray)  {
    return
  }
  let menu = []
  for(let item in menuArray) {
    if(menuArray[item].children.length !== 0) {
      menu.push(
      <li>
        {buildLink(menuArray[item])}
        <ul className="submenu">
          {buildMenu(menuArray[item].children)}
        </ul>
      </li>)
    } else {
      menu.push(<li>{buildLink(menuArray[item])}</li>)
    }
  }

  return menu

};

function generateMenu(menuLinks, menuName) {
  let menu

  menu = createMenuHierarchy(menuLinks.allMenuLinkContentMenuLinkContent.edges, menuName)
  menu = buildMenu(menu)

  return menu
}

const Menu = ({menuName}) => (

   <StaticQuery
      query={
        graphql`
        query MenuQuery {
          allMenuLinkContentMenuLinkContent(sort: {order: ASC, fields: weight}) {
            edges {
              node {
                enabled
                title
                expanded
                external
                langcode
                weight
                link {
                  uri
                  uri_alias
                }
                drupal_parent_menu_item
                bundle
                drupal_id
                menu_name
              }
            }
          }
        }
      `
      }
      render={data => (
        <nav className={menuName}>
          <ul >
            {generateMenu(data, menuName)}
          </ul>
        </nav>

      )}
   />
)

Menu.propTypes = {
  menuName: PropTypes.string,
}

Menu.defaultProps = {
  menuName: `main`,
}

export default Menu

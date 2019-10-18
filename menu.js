import React from "react"
import { StaticQuery, graphql, Link } from "gatsby"
import PropTypes from "prop-types";

function unflatten(arr, menu_name) {
  var tree = [],
     mappedArr = {},
     arrElem,
     mappedElem

  // First map the nodes of the array to an object -> create a hash table.
  for (var i = 0, len = arr.length; i < len; i++) {
    arrElem = arr[i].node
    
    if (arrElem.menu_name === menu_name && arrElem.enabled === true) {
      mappedArr[arrElem.drupal_id] = arrElem;
      if (arrElem.drupal_parent_menu_item !== null && arrElem.drupal_parent_menu_item.includes('menu_link_content:')) {
        var stripped_drupal_id = arrElem.drupal_parent_menu_item.replace('menu_link_content:', '')
        mappedArr[arrElem.drupal_id].drupal_parent_menu_item = stripped_drupal_id
      }
      mappedArr[arrElem.drupal_id]['children'] = []
    }
  }

  for (var id in mappedArr) {
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

function printMenu(menu){
  if(!menu) return {

  }
  var str = ""
  for(var i in menu) {
    if(menu[i].children.length !== 0)
      str+= "<li><a href='"+ menu[i].link.uri_alias +"' /> "+menu[i].title+"</a><ul class='submenu'>"+printMenu(menu[i].children)+"</ul></li>"
    else
      str+= "<li><a href='"+ menu[i].link.uri_alias +"' />"+ menu[i].title+"</a></li>"
  }
  return str;
};

function traverseTree(arr, menu_name) {
  var menu
  menu = unflatten(arr.allMenuLinkContentMenuLinkContent.edges, menu_name)
  console.log(menu)
  menu = printMenu(menu)

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
           <ul dangerouslySetInnerHTML={{__html: traverseTree(data, menuName)}} />
      )}
   />
)

Menu.propTypes = {
  menuName: PropTypes.string,
}

Menu.defaultProps = {
  menuName: `primary-menu`,
}

export default Menu

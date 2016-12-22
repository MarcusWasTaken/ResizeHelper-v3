import React from 'react'

const imageListItem = ({ id, name, onClick }) => (
  <li>
    <a 
      href="#"
      onClick={() => { onClick(id)} }
    >
      {name}
    </a>
  </li>
)

export default imageListItem
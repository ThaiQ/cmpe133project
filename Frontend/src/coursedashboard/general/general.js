import React, { useEffect, useState } from 'react';
import { ListGroup, ListGroupItem, Badge } from 'reactstrap';
import { Link } from 'react-router-dom'
import '../dashboard.css'

const General = (props) => {

  const { todo } = require('../../Config/data')

  useEffect(() => { }, [todo])

  const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '');

  let items = [
    {
      text: 'Announcement',
      href: '/dashboard'
    },
    {
      text: 'Assignments',
      href: `/viewassignments/${props.courseID}`
    },
    {
      text: 'Quizzes/Tests',
      href: `/viewquizzes/${props.courseID}`
    },
    {
      text: 'Grade',
      href: '/dashboard'
    },
    {
      text: 'People',
      href: '/people/People'
    },
    {
      text: 'Group',
      href: '/dashboard'
    }
  ]

  return (
    <ListGroup id='dashb-general'> 
      {props.items? props.items.map((item, ind) => {
        return <Link to={item.href} className='dash-general-ani' key={ind}>
          <ListGroupItem key={ind} className="justify-content-between">{item.text} <Badge pill>{item.count == 0 ? 0 : item.count}</Badge></ListGroupItem>
        </Link>
      })
      :
      items.map((item, ind) => {
        return <Link to={item.href} className='dash-general-ani'>
          <ListGroupItem key={ind} className="justify-content-between">{item.text} <Badge pill>{item.count == 0 ? 0 : item.count}</Badge></ListGroupItem>
        </Link>
      })
      }
      {user.AccessLevel === "Student"?'':
        <Link to='/dashboard' className='dash-general-ani'>
          <ListGroupItem className="justify-content-between">Setting</ListGroupItem>
        </Link>}
    </ListGroup >
  );
}

export default General;
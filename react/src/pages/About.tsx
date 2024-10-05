import React, { useEffect, useState } from 'react'
import '../scss/styles.scss'

import { useFetching } from '../hooks/useFetching'

function About() {
  const [val1, setVal1] = useState('')
  const [val2, setVal2] = useState('')
  //const [loading, setLoading] = useState(true);

  const SucessAjax = (data: any) => {
    setVal1(data['param1'])
    setVal2(data['param2'])
  }

  const [GetData, loading, err] = useFetching(SucessAjax)

  useEffect(() => {
    GetData('./get_data')

    return () => {
      // код выполняется при размонтировании компонента (закрытии)
      console.log('Component unmounted')
    }
  })

  if (loading) {
    return <div>Загрузка данных</div>
  } else {
    return (
      <div className="row">
        <div className="col-md-12">
          <p>
            <h3>{val1}</h3>
          </p>
        </div>

        <div className="col-md-12">
          <p>
            <h3>{val2}</h3>
          </p>
        </div>

        <div className="col-md-12">
          <p>
            <h3>About page jhbjh</h3>
          </p>
        </div>
        <a href="#" className="btn btn-secondary" role="button">
          Click me
        </a>
      </div>
    )
  }
}

export default About

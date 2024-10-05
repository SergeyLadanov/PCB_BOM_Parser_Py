import React, { useEffect, useState } from 'react'
import Main, { useMainForm } from '../pages/Main'
import $ from 'jquery'

function MainContainer() {
  const Form = useMainForm()

  useEffect(() => {
    return () => {}
  })

  return <Main form={Form} />
}

export default MainContainer

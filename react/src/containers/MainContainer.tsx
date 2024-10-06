import React, { useEffect, useState } from 'react'
import SourceDataForm, { useSourceDataForm } from '../forms/SourceDataForm'
import $ from 'jquery'
import ModalForm, { useModalForm } from '../forms/ModalForm'
import TableForm from '../forms/TableForm'

function MainContainer() {
  const SrcDataForm = useSourceDataForm()
  const ModalListForm = useModalForm()

  useEffect(() => {
    return () => {}
  })

  return (
    <>
      <SourceDataForm form={SrcDataForm} />
      <div className="my-3 p-3 bg-body rounded shadow-sm">
        <ModalForm form={ModalListForm} />
        <TableForm />
      </div>
    </>
  )
}

export default MainContainer

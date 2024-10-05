import React, { useEffect, useState } from 'react'
import '../scss/styles.scss'

interface FormData {
  Val1: string
  Val2: string
}

interface FormController extends FormData {
  SetVal1: (value: string) => void
  SetVal2: (value: string) => void
}

interface FormProps {
  form: FormController
  OnButtonClick: () => void
}

export function useMainForm(): FormController {
  const [formState, setFormData] = useState<FormData>({
    Val1: 'p1',
    Val2: 'p2'
  })

  const Form: FormController = {
    ...formState,
    SetVal1: (value: string) => setFormData(prev => ({ ...prev, Val1: value })),
    SetVal2: (value: string) => setFormData(prev => ({ ...prev, Val2: value }))
  }

  return Form
}

function Main({ form, OnButtonClick }: FormProps) {
  const ButtonHandler = (event: React.MouseEvent<HTMLAnchorElement>) => {
    OnButtonClick()
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <p>
          <h3>Start page</h3>
        </p>
      </div>

      <div className="col-md-12">
        <p>
          <h3>{form.Val1}</h3>
        </p>
      </div>

      <div className="col-md-12">
        <p>
          <h3>{form.Val2}</h3>
        </p>
      </div>
      <a
        href="#"
        className="btn btn-primary"
        onClick={ButtonHandler}
        role="button"
      >
        Click me
      </a>
    </div>
  )
}

export default Main

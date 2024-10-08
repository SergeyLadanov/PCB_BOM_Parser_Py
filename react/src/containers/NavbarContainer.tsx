import React, { useEffect, useState } from 'react'
import Navbar, { useNavbar } from '../components/Navbar'
import { useFetching } from '../hooks/useFetching'

interface VersionInfo {
  version: string
}

function NavbarContainer() {
  const API_URL = './version'

  const navBar = useNavbar()
  const [GetData, Loading, get_err] = useFetching()

  const OnDataReceived = (data: VersionInfo) => {
    navBar.SetVersion(data.version)
  }

  useEffect(() => {
    if (Loading) {
      GetData(API_URL).then(OnDataReceived)
    }

    return () => {}
  })

  return (
    <>
      <Navbar form={navBar} />
    </>
  )
}

export default NavbarContainer

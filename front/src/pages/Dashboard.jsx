import { faArrowRight, faComments, faDollar, faMessage, faMoneyBill, faMoneyBillTransfer, faMoneyBillTrendUp, faMoneyBills, faPaperPlane, faSignal5, faStore, faStoreAlt, faTachometerAlt, faUser, faUserGroup, faUserShield, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useCountAllInfoQuery } from "../features/api/apiDashboardSlice"
import { Link } from "react-router-dom"
import UserChart from '../components/UserChart'
import { formatRp } from "../utils/FormatRp"
import DashboardCard from '../components/DashboardCard'
import SummaryChart from '../components/SummaryCart'
import TopSellingProducts from '../components/TopSellingProducts'
import { Helmet } from 'react-helmet'

function Dashboard({ site }) {
  const [ users, setUsers ] = useState(0)
  const [ products, setProducts ] = useState(0)
  const [ topSelling, setSelling ] = useState(0)
  const [ episodes, setEpisodes ] = useState(0)
  const [ transactions, setTransactions ] = useState(0)
  const [ incomes, setIncomes ] = useState(0)
  const [ username, setUsername ] = useState(null)
  const { dataUser } = useSelector(state=> state.auth)
  const { data } = useCountAllInfoQuery()

  useEffect(() => {
    if(data) {
      // setEpisodes(data.response.episodes)
      // setSeries(data.response.series)
      setSelling(data.response.topSelling)
      setUsers(data.response.usersCount)
      setProducts(data.response.productsCount)
      setTransactions(data.response.transactionsCount)
      setIncomes(data.response.incomesCount)
    }
  },[ data ])

  useEffect(() => {
    if(dataUser?.username) setUsername(dataUser.username)
  },[ dataUser ])

  return (
    <div className="w-full">
      <Helmet>
            <title>{ site } - Dashboard</title>
        </Helmet>
      <h1 className="mb-5 font-bold">Dashboard</h1>
      <div className="grid grid-cols-4 gap-3">
        <Link to={`/api/transactions`}>
          <DashboardCard  
              title="Pendapatan"
              value={ formatRp(incomes) }
              description=""
              color="bg-green-700"
              textColor="text-slate-100"
              icon={<FontAwesomeIcon icon={faMoneyBillTrendUp}/>}
          />
        </Link>
        <Link to={`/api/users`} >
          <DashboardCard  
              title="Total Pelanggan"
              value={ users }
              description=""
              color="bg-blue-500"
              textColor="text-slate-100"
              icon={<FontAwesomeIcon icon={faUsers}/>}
          />
        </Link>
        <Link to={`/api/products`} >
          <DashboardCard  
              title="Total Products"
              value={ products }
              description=""
              color="bg-cyan-500"
              textColor="text-slate-100"
              icon={<FontAwesomeIcon icon={faStore}/>}
          />
        </Link>
        <Link to={`/api/transactions`} >
          <DashboardCard  
              title="Total Transaksi"
              value={ transactions }
              description=""
              color="bg-green-500"
              textColor="text-slate-100"
              icon={<FontAwesomeIcon icon={faMoneyBills}/>}
          />
        </Link>
      </div>
      <div className="grid gap-3 grid-cols-2 mt-10">
        <SummaryChart />
        <TopSellingProducts data={topSelling} />
      </div>
      <div className="mt-10">
          <UserChart />
      </div>
    </div>
  );
}

export default Dashboard;
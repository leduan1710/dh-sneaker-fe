import { Avatar, Box, Dialog, DialogTitle, Divider, LinearProgress } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useStore } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import LeftNav from '../../../components/user-guest/info-user/LeftNav';
import { GetApi, PostApi } from '../../../untils/Api';
import { Button, Input } from '../../../components/ComponentsLogin';
import { filterInputNumber, formatPrice, hideMiddleChars, toastSuccess, toastWarning } from '../../../untils/Logic';
import InputIcon from '@mui/icons-material/Input';
import OutputIcon from '@mui/icons-material/Output';
import { change_is_loading } from '../../../reducers/Actions';
import { HOST_BE, USD } from '../../../common/Common';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { enUS } from 'date-fns/locale';
import { ReducerProps } from '../../../reducers/ReducersProps';
import GamepadIcon from '@mui/icons-material/Gamepad';
import { socket_IO_Client } from '../../../routes/MainRoutes';
interface WalletProps {}

const Wallet: React.FC<WalletProps> = (props) => {
    const store = useStore();
    const nav = useNavigate();
    const [wallet, setWallet] = useState<any>(undefined);
    const [numberDeposite, setNumberDeposite] = useState<string>('');
    const [numberWithdraw, setNumberWithdraw] = useState<string>('');

    const lng = useSelector((state: ReducerProps) => state.lng);
    const { t } = useTranslation();
    const [transactions, setTransactions] = useState<any>([]);
    const [requestWithdraw, setRequestWithdraw] = useState<any>(undefined);

    const getWallet = async () => {
        const res = await GetApi('/user/get-wallet', localStorage.getItem('token'));
        if (res.data.message == 'Success') {
            change_is_loading(true);
            setWallet(res.data.wallet);
            if (res.data.wallet.length > 0) {
                const resTransaction = await GetApi(
                    `/user/get-transaction/${res.data.wallet[0].id}`,
                    localStorage.getItem('token'),
                );
                if (resTransaction.data.message == 'Success') {
                    setTransactions(resTransaction.data.transactions);
                }
                const resRequestWithdraw = await GetApi('/user/get-request-withdraw', localStorage.getItem('token'));
                if (resRequestWithdraw) {
                    setRequestWithdraw(resRequestWithdraw.data.requestWithdraw);
                }
            }

            change_is_loading(false);
        }
    };
    const handleDeposite = async () => {
        change_is_loading(true);
        const res = await PostApi('/user/deposite-wallet', localStorage.getItem('token'), { balance: numberDeposite });
        if (res.data.message == 'Success') {
            toastSuccess(t('auth.Success'));
            setWallet([res.data.deposite.wallet]);
            const resTransaction = await GetApi(
                `/user/get-transaction/${res.data.deposite.wallet.id}`,
                localStorage.getItem('token'),
            );
            if (resTransaction.data.message == 'Success') {
                setTransactions(resTransaction.data.transactions);
            }
            setOpenDialogDeposite(false);
            setIsShowPaypal(false);
        }
        change_is_loading(false);
    };
    const handleWithDraw = async () => {
        if (numberWithdraw == '') {
            toastWarning(t('user.PleaseEnterNumber'));
        } else if (parseFloat(wallet[0].balance) - parseFloat(numberWithdraw) < 0) {
            toastWarning(t('user.NotEnoughBalance'));
        } else {
            const res = await PostApi('/user/withdraw', localStorage.getItem('token'), {
                value: numberWithdraw,
                nameBank: wallet[0].nameBank,
                numberBank: wallet[0].numberBank,
                nameUser: wallet[0].nameUser,
            });
            if (res.data.message == 'Success') {
                toastSuccess(t('toast.Success'));
                getWallet();
            }
            if (res.data.message == 'Dont allow to withdraw more') {
                toastWarning(t('user.There is a transaction being processed'));
            }
        }
        setOpenDialogWithdraw(false);
    };
    //
    const [openDialogDeposite, setOpenDialogDeposite] = React.useState(false);
    const [openDialogWithdraw, setOpenDialogWithdraw] = React.useState(false);

    const handleOpenDiposite = () => {
        setOpenDialogDeposite(true);
    };

    const handleCloseDeposite = () => {
        setOpenDialogDeposite(false);
        setIsShowPaypal(false);
        setNumberDeposite('');
    };
    const handleOpenWithdraw = () => {
        setOpenDialogWithdraw(true);
    };

    const handleCloseWithdraw = () => {
        setOpenDialogWithdraw(false);
        setNumberWithdraw('');
    };
    //
    const [isShowPaypal, setIsShowPaypal] = useState<boolean>(false);
    const loadSDK = (isShowPaypal: boolean) => {
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.REACT_APP_YOUR_CLIENT_ID}`;
        script.async = true;
        script.onload = () => {
            window.paypal
                .Buttons({
                    createOrder: async (data: any, actions: any) => {
                        console.log(numberDeposite);
                        if (numberDeposite == '') {
                            toastWarning(t('user.PleaseEnterNumber'));
                            return;
                        }
                        const totalPrice = parseFloat((parseFloat(numberDeposite) / USD).toFixed(2));
                        const response = await fetch(`${HOST_BE}/create-order`, {
                            method: 'post',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ amount: totalPrice, quantity: 1 }),
                        });
                        const orderData = await response.json();
                        return orderData.id;
                    },
                    onApprove: async (data: any, actions: any) => {
                        const response = await fetch(`${HOST_BE}/capture-order/${data.orderID}`, {
                            method: 'post',
                        });
                        const orderData = await response.json();
                        if (orderData) {
                            handleDeposite();
                        }
                    },
                    onError: (err: any) => {},
                })
                .render('#paypal-button-container');
        };
        if (isShowPaypal) {
            document.body.appendChild(script);
        }
    };
    useEffect(() => {
        getWallet();
        socket_IO_Client.on('reqWalletNew', (data) => {
            if (window.location.pathname.startsWith('/user/wallet')) getWallet();
        });
    }, []);
    useEffect(() => {
        loadSDK(isShowPaypal);
    }, [isShowPaypal]);
    return (
        <>
            <div className="container marginTop">
                <div className="grid grid-cols-4 gap-4">
                    <div className="hidden lg:block col-span-1 bg-white box-shadow rounded-xl">
                        <LeftNav index={2} />
                    </div>
                    <div className="col-span-4 lg:col-span-3 mt-12 lg:mt-0">
                        {wallet ? (
                            wallet.length > 0 ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 grid grid-cols-2 gap-4">
                                        <div className="col-span-1 box-shadow rounded p-6 ">
                                            <div className="font-bolld text-xl text-blue-300">
                                                {t('user.Address')} : 0x{hideMiddleChars(wallet[0].id)}
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <div className="font-bolld text-xl">{t('user.Balance')} : </div>
                                                    <div className="pl-3">
                                                        {wallet[0].balance == 0
                                                            ? '0 VND'
                                                            : formatPrice(wallet[0].balance)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bolld text-xl">{t('orther.Locked')} : </div>
                                                    <div className="pl-3">
                                                        {wallet[0].lockedBalance == 0
                                                            ? '0 VND'
                                                            : formatPrice(wallet[0].lockedBalance)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-1 grid grid-cols-2 box-shadow rounded p-6 flex justify-center">
                                            <div className="col-span-1 flex flex-wrap justify-center items-center ">
                                                <div
                                                    onClick={handleOpenDiposite}
                                                    style={{ width: 50, height: 50 }}
                                                    className="border border-gray-300 rounded-full cursor-pointer flex justify-center items-center hover:bg-gray-300 transition-all duration-500"
                                                >
                                                    <InputIcon />
                                                </div>
                                                <div className="w-full text-center">{t('user.Deposite')}</div>
                                            </div>

                                            <div className="col-span-1 flex flex-wrap  justify-center items-center">
                                                <div
                                                    onClick={handleOpenWithdraw}
                                                    style={{ width: 50, height: 50 }}
                                                    className="border border-gray-300 rounded-full cursor-pointer flex justify-center items-center hover:bg-gray-300 transition-all duration-500"
                                                >
                                                    <OutputIcon />
                                                </div>
                                                <div className="w-full text-center">{t('user.Withdraw')}</div>
                                            </div>
                                        </div>
                                        <div className="col-span-2 box-shadow rounded p-6">
                                            <div className="text-xl">{t('user.MethodBank')}</div>
                                            <div className="font-thin">
                                                {t('user.NameBank')} : {wallet[0].nameBank}
                                            </div>
                                            <div className="font-thin">
                                                {t('user.NumberAccount')} : {wallet[0].numberBank}
                                            </div>
                                            <div className="font-thin">
                                                {t('user.NameAccount')} : {wallet[0].nameUser}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ height: 230 }} className="col-span-2 p-3 box-shadow rounded">
                                        <div className="text-xl">{t('user.Pending')} : </div>
                                        <div className="p-2">
                                            <Divider />
                                        </div>
                                        <div>
                                            {requestWithdraw ? (
                                                <div className="box-shadow p-3 rounded-lg relative">
                                                    <div className="text-2xl  text-blue-300">{t('user.Withdraw')}</div>

                                                    <div className="mt-3 ml-3 absolute top-10 right-6 ">
                                                        - {formatPrice(requestWithdraw.value)}
                                                    </div>
                                                    <div className="mt-3 ml-3 absolute top-1 right-6 font-thin text-sm">
                                                        {lng == 'vn'
                                                            ? formatDistanceToNow(requestWithdraw.createDate, {
                                                                  addSuffix: true,
                                                                  locale: vi,
                                                              })
                                                            : formatDistanceToNow(requestWithdraw.createDate, {
                                                                  addSuffix: true,
                                                                  locale: enUS,
                                                              })}
                                                    </div>
                                                    <div className="mt-3 ml-3">
                                                        {t('user.NameBank')} : {requestWithdraw.nameBank}
                                                    </div>
                                                    <div className="mt-1 ml-3">
                                                        {t('user.NumberAccount')} : {requestWithdraw.numberBank}
                                                    </div>
                                                    <div className="mt-1 ml-3">
                                                        {t('user.NameAccount')} : {requestWithdraw.nameUser}
                                                    </div>
                                                    <Box sx={{ width: '100%', marginTop: 1 }}>
                                                        <LinearProgress />
                                                    </Box>
                                                </div>
                                            ) : (
                                                <div className="flex justify-center items-center pt-6">
                                                    <GamepadIcon />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ height: 500 }} className="col-span-2 p-3 box-shadow rounded">
                                        <div className="text-xl">{t('user.History')} : </div>
                                        <div className="p-2">
                                            <Divider />
                                        </div>
                                        <div>
                                            {transactions.length > 0 ? (
                                                <>
                                                    <TableContainer component={Paper}>
                                                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell>{t('user.Code')}</TableCell>
                                                                    <TableCell align="right">
                                                                        {t('user.Value')}
                                                                    </TableCell>
                                                                    <TableCell align="right">
                                                                        {t('user.Describe')}
                                                                    </TableCell>
                                                                    <TableCell align="right">{t('From')}</TableCell>
                                                                    <TableCell align="right">{t('To')}</TableCell>
                                                                    <TableCell align="right">
                                                                        {t('user.Time')}
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableHead>

                                                            <TableBody>
                                                                {transactions.map((transaction: any) => (
                                                                    <TableRow
                                                                        key={transaction.id}
                                                                        sx={{
                                                                            '&:last-child td, &:last-child th': {
                                                                                border: 0,
                                                                            },
                                                                        }}
                                                                    >
                                                                        <TableCell component="th" scope="row">
                                                                            {transaction.id}
                                                                        </TableCell>
                                                                        <TableCell
                                                                            style={{
                                                                                color:
                                                                                    transaction.describe == 'deposite'
                                                                                        ? 'green'
                                                                                        : transaction.describe ==
                                                                                          'withdraw'
                                                                                        ? 'red'
                                                                                        : 'black',
                                                                            }}
                                                                            align="right"
                                                                        >
                                                                            {transaction.describe == 'deposite'
                                                                                ? '+'
                                                                                : transaction.describe == 'withdraw'
                                                                                ? '-'
                                                                                : ''}
                                                                            {formatPrice(transaction.value)}
                                                                        </TableCell>
                                                                        <TableCell
                                                                            style={{
                                                                                color:
                                                                                    transaction.describe == 'deposite'
                                                                                        ? 'green'
                                                                                        : transaction.describe ==
                                                                                          'withdraw'
                                                                                        ? 'red'
                                                                                        : 'black',
                                                                            }}
                                                                            align="right"
                                                                        >
                                                                            {transaction.describe}
                                                                        </TableCell>
                                                                        <TableCell
                                                                            style={{
                                                                                color:
                                                                                    transaction.describe == 'deposite'
                                                                                        ? 'green'
                                                                                        : transaction.describe ==
                                                                                          'withdraw'
                                                                                        ? 'red'
                                                                                        : 'black',
                                                                            }}
                                                                            align="right"
                                                                        >
                                                                            {transaction.from != '-'
                                                                                ? '0x' +
                                                                                  hideMiddleChars(transaction.from)
                                                                                : '-'}
                                                                        </TableCell>
                                                                        <TableCell
                                                                            style={{
                                                                                color:
                                                                                    transaction.describe == 'deposite'
                                                                                        ? 'green'
                                                                                        : transaction.describe ==
                                                                                          'withdraw'
                                                                                        ? 'red'
                                                                                        : 'black',
                                                                            }}
                                                                            align="right"
                                                                        >
                                                                            {transaction.to
                                                                                ? '0x' + hideMiddleChars(transaction.to)
                                                                                : '-'}
                                                                        </TableCell>
                                                                        <TableCell align="right">
                                                                            {lng == 'vn'
                                                                                ? formatDistanceToNow(
                                                                                      transaction.createDate,
                                                                                      {
                                                                                          addSuffix: true,
                                                                                          locale: vi,
                                                                                      },
                                                                                  )
                                                                                : formatDistanceToNow(
                                                                                      transaction.createDate,
                                                                                      {
                                                                                          addSuffix: true,
                                                                                          locale: enUS,
                                                                                      },
                                                                                  )}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-center">
                                    <Button onClick={() => nav('/user/wallet/register')}>
                                        {t('user.RegisterWallet')}
                                    </Button>
                                </div>
                            )
                        ) : null}
                    </div>
                </div>
            </div>
            <Dialog
                open={openDialogDeposite}
                onClose={handleCloseDeposite}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle sx={{ textTransform: 'capitalize' }} id="dialog-title">
                    {t('user.Deposite')}
                </DialogTitle>
                <div style={{ paddingRight: 70, paddingLeft: 70, paddingTop: 10, paddingBottom: 30 }}>
                    {!isShowPaypal ? (
                        <div>
                            <Input
                                placeholder={t('user.EnterNumber')}
                                value={numberDeposite == '' ? '' : formatPrice(parseFloat(numberDeposite))}
                                onChange={(e: any) => filterInputNumber(e.target.value, setNumberDeposite)}
                            />
                            <Button onClick={() => setIsShowPaypal(true)} className="mt-6">
                                {t('action.Accept')}
                            </Button>
                        </div>
                    ) : (
                        <div>
                            <h1>Thanh toán với PayPal</h1>
                            <div id="paypal-button-container"></div>
                        </div>
                    )}
                </div>
            </Dialog>
            <Dialog open={openDialogWithdraw} onClose={handleCloseWithdraw}>
                <DialogTitle sx={{ textTransform: 'capitalize' }} id="dialog-title">
                    {t('user.Withdraw')}
                </DialogTitle>
                <div style={{ paddingRight: 70, paddingLeft: 70, paddingTop: 10, paddingBottom: 30 }}>
                    <div>
                        <li>
                            {t('user.NameBank')} : {wallet ? (wallet.length > 0 ? wallet[0].nameBank : null) : null}
                        </li>
                        <li>
                            {t('user.NumberAccount')} :
                            {wallet ? (wallet.length > 0 ? wallet[0].numberBank : null) : null}
                        </li>
                        <li className="mb-6">
                            {t('user.NameAccount')} : {wallet ? (wallet.length > 0 ? wallet[0].nameUser : null) : null}
                        </li>
                        <Input
                            placeholder={t('user.EnterNumber')}
                            value={numberWithdraw == '' ? '' : formatPrice(parseFloat(numberWithdraw))}
                            onChange={(e: any) => filterInputNumber(e.target.value, setNumberWithdraw)}
                        />
                        <Button onClick={handleWithDraw} className="mt-6">
                            {t('action.Accept')}
                        </Button>
                    </div>
                </div>
            </Dialog>
        </>
    );
};
export default Wallet;

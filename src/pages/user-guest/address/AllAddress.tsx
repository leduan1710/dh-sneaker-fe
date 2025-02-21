import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useStore } from 'react-redux';
import LeftNav from '../../../components/user-guest/info-user/LeftNav';
import { ReducerProps } from '../../../reducers/ReducersProps';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import AddressItem from '../../../components/user-guest/address/AddressItem';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../../../components/user-guest/footer/Footer';

interface AllAddressProps {}

const AllAddress: React.FC<AllAddressProps> = (props) => {
    const store = useStore();
    const { t } = useTranslation();
    const nav = useNavigate();
    const listAddress = useSelector((state: ReducerProps) => state.listAddress);
    const handleClickCreateAddress = () => {
        nav('/user/address/create');
    };
    return (
        <div>
            <div style={{ marginTop: 120 }} className="container z-10">
                <div className="grid grid-cols-4  gap-4 container">
                    <div className="hidden lg:block col-span-1 bg-white box-shadow rounded-xl">
                        <LeftNav index={1} />
                    </div>
                    <div className="col-span-4 lg:col-span-3 mt-12 lg:mt-0">
                        <h1 className="text-2xl font-bold">{t('user.Address')}</h1>
                        <div className="bg-white p-6 rounded-lg box-shadow mt-4 relative">
                            <div>
                                <Button
                                    onClick={handleClickCreateAddress}
                                    style={{ height: 50 }}
                                    fullWidth
                                    variant="outlined"
                                >
                                    <AddIcon />
                                </Button>
                            </div>
                            <div>
                                <AnimatePresence>
                                    {listAddress.length > 0
                                        ? listAddress.map((address: any, index: any) => {
                                              if (index == 0) {
                                                  return (
                                                      <motion.li
                                                          style={{ listStyleType: 'none' }}
                                                          key={index}
                                                          initial={{ opacity: 1, height: 'auto' }}
                                                          exit={{
                                                              opacity: 0,
                                                              height: 0,
                                                              transition: { duration: 0.2 },
                                                          }}
                                                          transition={{ duration: 0.2 }}
                                                      >
                                                          <AddressItem key={index} address={address} index={index} />
                                                      </motion.li>
                                                  );
                                              } else {
                                                  return (
                                                      <motion.li
                                                          style={{ listStyleType: 'none' }}
                                                          key={index}
                                                          initial={{ opacity: 1, height: 'auto' }}
                                                          exit={{
                                                              opacity: 0,
                                                              height: 0,
                                                              transition: { duration: 0.2 },
                                                          }}
                                                          transition={{ duration: 0.2 }}
                                                      >
                                                          <AddressItem key={index} address={address} index={index} />
                                                      </motion.li>
                                                  );
                                              }
                                          })
                                        : null}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};
export default AllAddress;

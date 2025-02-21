import React, { useEffect, useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import { passwordStrength } from 'check-password-strength';
import { useTranslation } from 'react-i18next';

interface CheckPasswordMeterProps {
    password: string;
}

const CheckPasswordMeter: React.FC<CheckPasswordMeterProps> = (props) => {
    const { password } = props;
    const [progress, setProgress] = useState<number>(0);
    const { t } = useTranslation();
    const funcProgressPercent = () => {
        // https://www.npmjs.com/package/check-password-strength for more info
        switch (passwordStrength(password).id) {
            case 0:
                return 25;
            case 1:
                return 50;
            case 2:
                return 75;
            case 3:
                return 100;
            default:
                return 0;
        }
    };
    useEffect(() => {
        setProgress(funcProgressPercent());
    }, [password]);
    return (
        <div className="mt-3">
            <LinearProgress variant="determinate" value={progress} />
        </div>
    );
};
export default CheckPasswordMeter;

import React from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Typography,
    DialogProps,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';

interface SizeRow {
    size: string;
    uk: string;
    eu: string;
    jp: string;
    vn: string;
    length: string;
}

interface SizeGuideDialogProps {
    open: boolean;
    onClose: () => void;
}

const SizeGuideDialog: React.FC<SizeGuideDialogProps> = ({ open, onClose }) => {
    const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');

    const sizeData: SizeRow[] = [
        { size: 'M3 W5', uk: '', eu: '34-35', jp: '21', vn: '35', length: '213 - 221' },
        { size: 'M4 W6', uk: 'M3 | W4', eu: '36-37', jp: '22', vn: '36', length: '222 - 229' },
        { size: 'M5 W7', uk: 'M4 | W5', eu: '37-38', jp: '23', vn: '37', length: '230 - 238' },
        { size: 'M6 W8', uk: 'M5 | W6', eu: '38-39', jp: '24', vn: '38-39', length: '239 - 246' },
        { size: 'M7 W9', uk: 'M6 | W7', eu: '39-40', jp: '25', vn: '40-41', length: '247 - 255' },
        { size: 'M8 W10', uk: 'M7 | W8', eu: '41-42', jp: '26', vn: '42', length: '256 - 263' },
        { size: 'M9 W11', uk: 'M8 | W9', eu: '42-43', jp: '27', vn: '43', length: '264 - 272' },
        { size: 'M10 W12', uk: 'M9 | W10', eu: '43-44', jp: '28', vn: '44', length: '273 - 279' },
        { size: 'M11', uk: '10', eu: '45-46', jp: '29', vn: '45', length: '280 - 287' },
        { size: 'M12', uk: '11', eu: '46-47', jp: '30', vn: '46', length: '288 - 296' },
        { size: 'M13', uk: '12', eu: '48-49', jp: '31', vn: '47', length: '297 - 304' },
    ];
    return (
        <Dialog
            open={open}
            onClose={onClose}
            scroll={scroll}
            fullWidth={true}
            maxWidth={'lg'}
            aria-labelledby="customized-dialog-title"
        >
            <DialogTitle id="scroll-dialog-title" sx={{ fontWeight: 'bold', fontSize: '20' }}>
                Hướng Dẫn Chọn Kích Thước
            </DialogTitle>

            <DialogContent dividers={scroll === 'paper'}>
                <Typography variant="h3" fontSize={21} sx={{ textAlign: 'center' }}>
                    HƯỚNG DẪN ĐO CHIỀU DÀI CHÂN
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, mt: 2, textAlign: 'justify' }}>
                    <strong>Bước 1:</strong> Đặt tờ giấy vuông góc với bức tường. Đứng lên mảnh giấy với gót chân chạm
                    nhẹ vào tường.
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, mt: 2, textAlign: 'justify' }}>
                    <strong>Bước 2:</strong> Đánh dấu đỉnh đầu của ngón chân dài nhất lên giấy. Đo khoảng cách từ tường
                    đến điểm đánh dấu để biết chiều dài chân (mm).
                </Typography>

                <Typography variant="body2" sx={{ mb: 2, mt: 2, textAlign: 'justify' }}>
                    <strong>Bước 3:</strong> So sánh số đo chiều dài chân với biểu đồ để chọn kích thước tương ứng trong
                    cột Crocs Size ( US Size ).
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, mt: 2, textAlign: 'justify', fontStyle: 'italic' }}>
                    Ví dụ: Chiều dài chân là 23.5cm tương đương 235mm, nằm trong khoảng 230-238 mm tương ứng với size
                    M5W7.
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, mt: 2, textAlign: 'justify', fontStyle: 'italic', color: 'blue' }}>
                    *Ngoài ra, bạn cũng có thể chọn size Crocs dựa theo size Việt Nam tương ứng.
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, mt: 2, textAlign: 'justify', fontStyle: 'italic' }}>
                    <strong>Lưu ý:</strong> Giày Crocs khi mang đúng size sẽ dư chân tầm 1-2cm để tạo độ thoải mái khi
                    di chuyển về lâu dài, đồng thời bạn có thể mang quai hậu phía sau ( đối với dòng Clog Classic ) để
                    giày khít chân hơn và di chuyển không bị rớt gót. Việc chọn size quá khít chiều dài chân sẽ khiến
                    bàn chân bị ma sát mạnh trong quá trình di chuyển hoặc đụng mũi gây ảnh hưởng đến sức khỏe.
                </Typography>
                <TableContainer component={Paper} sx={{ mt: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: 'rgba(7, 110, 145, 0.89)' }}>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Crocs Size (US)</TableCell>
                                <TableCell sx={{ color: 'white' }}>UK</TableCell>
                                <TableCell sx={{ color: 'white' }}>EU</TableCell>
                                <TableCell sx={{ color: 'white' }}>JP</TableCell>
                                <TableCell sx={{ color: 'white' }}>VN</TableCell>
                                <TableCell sx={{ color: 'white' }}>Chiều dài chân (mm)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sizeData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ fontWeight: 'bold', color: 'rgb(207, 93, 0)' }}>
                                        {row.size}
                                    </TableCell>
                                    <TableCell>{row.uk}</TableCell>
                                    <TableCell>{row.eu}</TableCell>
                                    <TableCell>{row.jp}</TableCell>
                                    <TableCell>{row.vn}</TableCell>
                                    <TableCell>{row.length}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SizeGuideDialog;

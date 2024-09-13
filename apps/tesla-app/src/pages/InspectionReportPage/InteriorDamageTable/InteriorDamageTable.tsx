import { Button } from '@monkvision/common-ui-web';
import { useMonkTheme } from '@monkvision/common';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';

export function InteriorDamageTable() {
  const { palette } = useMonkTheme();

  return (
    <>
      <Table>
        {/* <TableCaption>A list of the interior damage.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>Area</TableHead>
            <TableHead>Damage types</TableHead>
            <TableHead className='text-right'>Deductions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className='font-medium'>Stearing Wheel</TableCell>
            <TableCell>Missing</TableCell>
            <TableCell className='text-right'>$250.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'end' }}>
        <Button primaryColor={palette.background.light} icon='add'>
          Damage
        </Button>
      </div>
    </>
  );
}

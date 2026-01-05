import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phone, Mail } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

export function PhoneEmailSection() {
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [phone, setPhone] = useState('0942438693');
  const [email, setEmail] = useState('vuanhu1993nta@gmail.com');
  const [newPhone, setNewPhone] = useState(phone);
  const [newEmail, setNewEmail] = useState(email);

  const handlePhoneSave = () => {
    setPhone(newPhone);
    setPhoneOpen(false);
  };

  const handleEmailSave = () => {
    setEmail(newEmail);
    setEmailOpen(false);
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Phone Section */}
      <div className="flex items-center justify-between p-6 bg-muted rounded-lg">
        <div className="flex items-center gap-4">
          <Phone className="w-6 h-6 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Số điện thoại</p>
            <p className="font-semibold text-foreground">{phone}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setNewPhone(phone);
            setPhoneOpen(true);
          }}
          className="text-primary border-primary hover:bg-primary/10"
        >
          Cập nhật
        </Button>
      </div>

      {/* Email Section */}
      <div className="flex items-center justify-between p-6 bg-muted rounded-lg">
        <div className="flex items-center gap-4">
          <Mail className="w-6 h-6 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Địa chỉ email</p>
            <p className="font-semibold text-foreground">{email}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setNewEmail(email);
            setEmailOpen(true);
          }}
          className="text-primary border-primary hover:bg-primary/10"
        >
          Cập nhật
        </Button>
      </div>

      {/* Phone Update Modal */}
      <Dialog open={phoneOpen} onOpenChange={setPhoneOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật số điện thoại</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="tel"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="Nhập số điện thoại mới"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPhoneOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handlePhoneSave}
              className="bg-primary text-primary-foreground"
            >
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Update Modal */}
      <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật địa chỉ email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Nhập email mới"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleEmailSave}
              className="bg-primary text-primary-foreground"
            >
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

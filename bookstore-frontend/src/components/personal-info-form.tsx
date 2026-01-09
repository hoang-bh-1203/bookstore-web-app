import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function PersonalInfoForm() {
  const [formData, setFormData] = useState({
    fullName: 'Vũ Anh Tú',
    nickname: '',
    day: '12',
    month: '4',
    year: '1993',
    gender: 'male',
    nationality: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i,
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      {/* Avatar Section */}
      <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
        <Avatar className="w-24 h-24">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Vũ" />
          <AvatarFallback>VT</AvatarFallback>
        </Avatar>
        <Button type="button" variant="outline" size="sm">
          Thay đổi ảnh đại diện
        </Button>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Họ & Tên
          </label>
          <Input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="w-full"
          />
        </div>

        {/* Nickname */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Nickname
          </label>
          <Input
            type="text"
            name="nickname"
            placeholder="Thêm nickname"
            value={formData.nickname}
            onChange={handleInputChange}
            className="w-full"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Ngày sinh
          </label>
          <div className="flex gap-4">
            <Select
              value={formData.day}
              onValueChange={(value) => handleSelectChange('day', value)}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {days.map((day) => (
                  <SelectItem key={day} value={String(day)}>
                    {String(day).padStart(2, '0')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={formData.month}
              onValueChange={(value) => handleSelectChange('month', value)}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={String(month)}>
                    {String(month).padStart(2, '0')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={formData.year}
              onValueChange={(value) => handleSelectChange('year', value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Giới tính
          </label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === 'male'}
                onChange={handleInputChange}
                className="w-4 h-4"
              />
              <span className="text-sm">Nam</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === 'female'}
                onChange={handleInputChange}
                className="w-4 h-4"
              />
              <span className="text-sm">Nữ</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="other"
                checked={formData.gender === 'other'}
                onChange={handleInputChange}
                className="w-4 h-4"
              />
              <span className="text-sm">Khác</span>
            </label>
          </div>
        </div>

        {/* Nationality */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Quốc tịch
          </label>
          <Select
            value={formData.nationality}
            onValueChange={(value) => handleSelectChange('nationality', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn quốc tịch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vietnam">Việt Nam</SelectItem>
              <SelectItem value="usa">Hoa Kỳ</SelectItem>
              <SelectItem value="japan">Nhật Bản</SelectItem>
              <SelectItem value="korea">Hàn Quốc</SelectItem>
              <SelectItem value="thailand">Thái Lan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            className="bg-primary text-primary-foreground px-8"
          >
            Lưu thay đổi
          </Button>
        </div>
      </div>
    </form>
  );
}

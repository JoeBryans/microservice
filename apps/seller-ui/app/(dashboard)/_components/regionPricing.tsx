"use client";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useState, useEffect } from 'react';

const RegionPricing = ({ setRegional }: any) => {
    // 1. Manage the list of inputs locally
    const [inputs, setInputs] = useState<any[]>([]);

    // 2. Add a new empty object to the list
    const handleClick = () => {
        setInputs([...inputs, { region: '', price: 0 }]);
    };

    // 3. Update a specific field at a specific index
    const handleInputChange = (index: number, field: string, value: string | number) => {
        const updatedInputs = [...inputs];
        updatedInputs[index][field] = value;
        setInputs(updatedInputs);
    };

    // 4. (Optional) Sync with parent whenever the local list changes
    useEffect(() => {
        setRegional(inputs);
    }, [inputs, setRegional]);

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button type='button' variant="outline" className='w-full mt-1'>
                        Add Regional & Pricing
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-106.25">
                    <DialogHeader>
                        <DialogTitle>Adding Regional & Pricing</DialogTitle>
                        <Button onClick={handleClick} className="mt-2">
                            Add new field
                        </Button>
                    </DialogHeader>

                    <div className="flex flex-col gap-4 mt-4 max-h-75 overflow-y-auto p-1">
                        {inputs.map((item, index) => (
                            <div key={index} className="flex gap-2 items-center border-b pb-4">
                                <div
                                    className='space-y-2'
                                >
                                    <Label htmlFor="region">Region</Label>
                                    <Input
                                        placeholder="Region (e.g. Lagos)"
                                        type="text"
                                        id="region"
                                        value={item.region}
                                        onChange={(e) => handleInputChange(index, 'region', e.target.value)}
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <Label>shipping price</Label>
                                    <Input
                                        placeholder="Price"
                                        type="number"
                                        value={item.price}
                                        onChange={(e) => handleInputChange(index, 'price', e.target.value)}
                                    />
                                </div>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => setInputs(inputs.filter((_, i) => i !== index))}
                                >
                                    X
                                </Button>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default RegionPricing;
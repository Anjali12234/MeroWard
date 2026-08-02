import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "@inertiajs/react";
import { Employee } from "@/types/Admin/Employee";

interface representativeProps {
    representatives: Employee[];
}

export default function RepresentativeCards({ representatives }: representativeProps) {
    return (
        <section>
                  
           {representatives.map((representative) => (

         
            <div className="flex items-center space-x-3 p-2 bg-slate-50 hover:bg-sky-50 rounded-xl border border-slate-100 mb-2 transition cursor-pointer">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rep1" alt="Rep" className="w-10 h-10 rounded-full border bg-slate-200" />
                            <div>
                                <h4 className="font-bold text-slate-800 text-xs">{representative.designation}</h4>
                                <p className="text-[10px] text-slate-500">{representative.name}</p>
                                <p className="text-[10px] text-slate-500"> <span>Phone</span> {representative.phone}</p>
                                <p className="text-[10px] text-slate-500"> <span>Email</span> {representative.email}</p>
                                <Link href="">
                                    <Button
                                        className="bg-white text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-full px-6 py-6 font-bold transition-all duration-300 group/btn shadow-xl"
                                    >
                                        View Detail
                                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        
           ))}
        </section>
        
    );
}

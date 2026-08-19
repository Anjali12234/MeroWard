<?php

namespace App\Enums;

enum EventStatus: string
{
    case UP_COMING = 'up_coming';
    case ON_GOING = 'on_going';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';

    public function label(): string
    {
        return match($this) {
            self::UP_COMING => 'Up Coming',
            self::ON_GOING => 'On Going',
            self::COMPLETED => 'Completed',
            self::CANCELLED => 'Cancelled',
        };
    }
}

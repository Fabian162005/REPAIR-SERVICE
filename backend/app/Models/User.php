<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
    'name', 'email', 'password', 'rol', 'activo',
    'dni', 'telefono', 'direccion',
];

protected $hidden = [
    'password', 'remember_token',
    'dni', 'telefono', 'direccion',
];
    protected $casts = [
        'password' => 'hashed',
        'activo'   => 'boolean',
    ];
}
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>{{ $notice->title_en }}</title>

    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f3f4f6;
            font-family: Arial, Helvetica, sans-serif;
            color: #1f2937;
        }

        .email-wrapper {
            width: 100%;
            padding: 40px 15px;
            box-sizing: border-box;
        }

        .email-container {
            max-width: 700px;
            margin: 0 auto;
            background: #ffffff;
            border: 1px solid #d1d5db;
            box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
        }

        /* =========================
           GOVERNMENT HEADER
        ========================= */

        .header {
            background: #ffffff;
            padding: 28px 30px;
            border-bottom: 5px solid #b91c1c;
            text-align: center;
        }

        .government {
            font-size: 13px;
            font-weight: bold;
            color: #374151;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 8px;
        }

        .office-name {
            font-size: 26px;
            font-weight: bold;
            color: #111827;
            margin: 0;
        }

        .office-subtitle {
            font-size: 14px;
            color: #6b7280;
            margin-top: 7px;
        }

        .red-line {
            width: 80px;
            height: 3px;
            background: #b91c1c;
            margin: 16px auto 0;
        }

        /* =========================
           NOTICE HEADER
        ========================= */

        .notice-section {
            padding: 30px 35px 15px;
        }

        .notice-badge {
            display: inline-block;
            background: #b91c1c;
            color: #ffffff;
            font-size: 11px;
            font-weight: bold;
            padding: 7px 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 16px;
        }

        .notice-title {
            margin: 0;
            font-size: 25px;
            line-height: 1.4;
            color: #111827;
        }

        /* =========================
           NOTICE INFORMATION
        ========================= */

        .notice-info {
            margin: 20px 35px;
            border: 1px solid #d1d5db;
            background: #f9fafb;
        }

        .info-row {
            padding: 13px 16px;
            border-bottom: 1px solid #e5e7eb;
        }

        .info-row:last-child {
            border-bottom: none;
        }

        .info-label {
            display: inline-block;
            width: 140px;
            font-weight: bold;
            color: #374151;
        }

        .info-value {
            color: #111827;
        }

        /* =========================
           CONTENT
        ========================= */

        .content {
            padding: 10px 35px 25px;
            font-size: 15px;
            line-height: 1.8;
            color: #374151;
        }

        .content p {
            margin: 12px 0;
        }

        .official-message {
            padding: 18px 20px;
            margin: 20px 0;
            border-left: 4px solid #b91c1c;
            background: #f9fafb;
        }

        /* =========================
           DOCUMENT BUTTON
        ========================= */

        .document-section {
            margin: 10px 35px 30px;
            padding: 22px;
            background: #fef2f2;
            border: 1px solid #fecaca;
            text-align: center;
        }

        .document-title {
            margin: 0 0 8px;
            font-size: 16px;
            font-weight: bold;
            color: #7f1d1d;
        }

        .document-note {
            margin: 0 0 18px;
            font-size: 13px;
            color: #6b7280;
        }

        .document-button {
            display: inline-block;
            padding: 11px 20px;
            background-color: #b91c1c;
            color: #ffffff !important;
            text-decoration: none;
            font-size: 14px;
            font-weight: bold;
            border-radius: 3px;
        }

        .document-button:hover {
            background-color: #991b1b;
        }

        /* =========================
           FOOTER
        ========================= */

        .footer {
            background: #1f2937;
            padding: 25px 30px;
            text-align: center;
            color: #d1d5db;
        }

        .footer-title {
            margin: 0 0 7px;
            font-size: 17px;
            font-weight: bold;
            color: #ffffff;
        }

        .footer-text {
            margin: 4px 0;
            font-size: 12px;
            line-height: 1.6;
        }

        .footer-divider {
            width: 50px;
            height: 2px;
            background: #b91c1c;
            margin: 15px auto;
        }

        .copyright {
            margin-top: 15px;
            font-size: 11px;
            color: #9ca3af;
        }

        /* =========================
           MOBILE
        ========================= */

        @media only screen and (max-width: 600px) {

            .email-wrapper {
                padding: 15px 8px;
            }

            .header {
                padding: 22px 15px;
            }

            .notice-section,
            .content {
                padding-left: 20px;
                padding-right: 20px;
            }

            .notice-info,
            .document-section {
                margin-left: 20px;
                margin-right: 20px;
            }

            .notice-title {
                font-size: 21px;
            }

            .info-label {
                display: block;
                width: auto;
                margin-bottom: 4px;
            }

            .office-name {
                font-size: 22px;
            }
        }
    </style>
</head>

<body>

    @php
        /*
    |--------------------------------------------------------------------------
    | Get Notice Document
    |--------------------------------------------------------------------------
    |
    | Your database stores document like:
    |
    | ["Notice/example.pdf"]
    |
    | Decode the JSON and generate the public storage URL.
    |
    */

        $documents = json_decode($notice->getRawOriginal('document'), true) ?? [];

        $documentUrl = null;

        if (!empty($documents) && is_array($documents)) {
            $documentPath = $documents[0];

            if (\Storage::disk('public')->exists($documentPath)) {
                $documentUrl = \Storage::disk('public')->url($documentPath);
            }
        }
    @endphp


    <div class="email-wrapper">

        <div class="email-container">

            {{-- ================================
             GOVERNMENT HEADER
        ================================= --}}

            <div class="header">

                <div class="government">
                    Government of Nepal
                </div>

                <h1 class="office-name">
                    MeroWard
                </h1>

                <div class="office-subtitle">
                    Digital Local Government Service
                </div>

                <div class="red-line"></div>

            </div>


            {{-- ================================
             NOTICE TITLE
        ================================= --}}

            <div class="notice-section">

                <div class="notice-badge">
                    Official Notice
                </div>

                <h2 class="notice-title">
                    {{ $notice->title_en }}
                </h2>

            </div>


            {{-- ================================
             NOTICE INFORMATION
        ================================= --}}

            <div class="notice-info">

                <div class="info-row">

                    <span class="info-label">
                        Notice Date:
                    </span>

                    <span class="info-value">
                        {{ \Carbon\Carbon::parse($notice->published_date)->format('F d, Y') }}
                    </span>

                </div>


                <div class="info-row">

                    <span class="info-label">
                        Notice ID:
                    </span>

                    <span class="info-value">
                        {{ $notice->id }}
                    </span>

                </div>


                @if ($notice->ward_id)
                    <div class="info-row">

                        <span class="info-label">
                            Ward:
                        </span>

                        <span class="info-value">
                            Ward No. {{ $notice->ward_id }}
                        </span>

                    </div>
                @endif

            </div>


            {{-- ================================
             MAIN MESSAGE
        ================================= --}}

            <div class="content">

                <p>
                    Dear Citizen,
                </p>

                <p>
                    This is to formally notify you that a new official notice
                    has been published by <strong>MeroWard</strong>.
                </p>


                <div class="official-message">

                    <strong>
                        {{ $notice->title_en }}
                    </strong>

                    <br>

                    Please review the official notice and take any necessary
                    action within the specified period.

                </div>


                <p>
                    Citizens are requested to carefully read the notice and
                    follow the instructions issued by the concerned
                    government authority.
                </p>


                <p>
                    Thank you for your cooperation.
                </p>

            </div>


            {{-- ================================
             DOCUMENT DOWNLOAD
        ================================= --}}

            @if ($documentUrl)
                <div class="document-section">

                    <p class="document-title">
                        Official Notice Document
                    </p>

                    <p class="document-note">
                        Please download and review the official notice document
                        for complete information and instructions.
                    </p>

                    <a href="{{ $documentUrl }}" target="_blank" class="document-button">
                        View / Download Official Notice
                    </a>

                </div>
            @endif


            {{-- ================================
             FOOTER
        ================================= --}}

            <div class="footer">

                <p class="footer-title">
                    MeroWard
                </p>

                <p class="footer-text">
                    Digital Local Government Service
                </p>

                <div class="footer-divider"></div>

                <p class="footer-text">
                    This is an automatically generated official notification.
                </p>

                <p class="footer-text">
                    Please do not reply directly to this email.
                </p>

                <p class="copyright">
                    © {{ date('Y') }} MeroWard. All Rights Reserved.
                </p>

            </div>

        </div>

    </div>

</body>

</html>

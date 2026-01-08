# Firestore Constants

Firestore quota limits, thresholds, and constants for Firebase operations.

## Purpose

Provides constants and configuration values for Firestore quota management including free tier limits, warning thresholds, and utility functions for quota calculations.

## For AI Agents

### Before Using Firestore Constants

1. **USE** constants for all quota values
2. **CHECK** quota thresholds before operations
3. **CALCULATE** quota usage with utility functions
4. **WARN** users when approaching limits
5. **NEVER** hardcode quota values

### Required Practices

1. **Use constants** - Import FREE_TIER_LIMITS and QUOTA_THRESHOLDS
2. **Calculate usage** - Use calculateQuotaUsage() function
3. **Check thresholds** - Use isQuotaThresholdReached()
4. **Monitor quota** - Track usage throughout the day
5. **Warn appropriately** - Show warnings at thresholds

### Forbidden Practices

## ❌ NEVER

- Hardcode quota values (50,000, 20,000, etc.)
- Ignore quota limits
- Skip quota monitoring
- Calculate quota manually
- Exceed free tier without warning

## ⚠️ Avoid

- Not checking quota before operations
- Hardcoding threshold percentages
- Not warning users at thresholds
- Calculating quota incorrectly
- Ignoring delete quota (monthly vs daily)

## Constants

### FREE_TIER_LIMITS

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/domain/constants`

**Purpose:** Firebase free tier daily/monthly quota limits

**Properties:**
- `dailyReads: number` - Daily read limit (50,000)
- `dailyWrites: number` - Daily write limit (20,000)
- `monthlyDeletes: number` - Monthly delete limit (20,000)

**Usage:**
- Use for quota calculations
- Display limits to users
- Calculate remaining quota
- Set up monitoring

**When to Use:**
- Calculating quota usage
- Displaying quota information
- Checking remaining quota
- Setting up alerts

**Important Notes:**
- Reads reset daily
- Writes reset daily
- Deletes reset monthly
- Different reset periods

### QUOTA_THRESHOLDS

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/domain/constants`

**Purpose:** Warning and critical threshold percentages

**Properties:**
- `warning: number` - Warning threshold (80%)
- `critical: number` - Critical threshold (90%)

**Usage:**
- Trigger warnings at 80%
- Trigger critical alerts at 90%
- Display warnings to users
- Implement throttling

**When to Use:**
- Checking if quota exceeded
- Showing warnings to users
- Implementing usage alerts
- Throttling operations

**Threshold Strategy:**
- Warning at 80% - Inform user
- Critical at 90% - Strong warning
- Limit at 100% - Block operations
- Consider upgrade prompts

## Utility Functions

### calculateQuotaUsage

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/domain/constants`

**Purpose:** Calculate quota usage percentages from raw numbers

**Parameters:**
- Object with `reads`, `writes`, `deletes` counts

**Returns:** `QuotaMetrics` object with:
- `totalReads`, `totalWrites`, `totalDeletes`
- `reads: QuotaStatus` - { used, limit, percentage }
- `writes: QuotaStatus` - { used, limit, percentage }
- `deletes: QuotaStatus` - { used, limit, percentage }

**QuotaStatus Properties:**
- `used: number` - Amount used
- `limit: number` - Total limit
- `percentage: number` - Usage percentage (0-100)

**Usage Strategy:**
1. Collect operation counts
2. Call calculateQuotaUsage()
3. Check percentages for each type
4. Display to user if needed
5. Implement throttling

**When to Use:**
- After batch operations
- Displaying quota status
- Checking before large operations
- Monitoring usage trends

### isQuotaThresholdReached

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/domain/constants`

**Purpose:** Check if quota usage has reached a specific threshold

**Parameters:**
- `metrics: QuotaMetrics` - From calculateQuotaUsage()
- `threshold: number` - Threshold percentage (80 or 90)

**Returns:** `boolean` - Whether threshold reached

**Usage Strategy:**
1. Calculate quota usage
2. Check if warning threshold reached
3. Check if critical threshold reached
4. Display appropriate warning
5. Throttle operations if needed

**When to Use:**
- After quota calculations
- Before large operations
- Displaying warnings
- Implementing throttling

## Quota Management Strategy

### Monitoring Quota

**Strategy:** Track quota usage throughout the day.

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/domain/constants`

**When to Monitor:**
- After write operations
- After read operations
- Periodically (every hour)
- Before large batch operations

**Monitoring Approach:**
1. Count operations by type
2. Use calculateQuotaUsage()
3. Check thresholds
4. Warn if approaching limit
5. Throttle if critical

### Warning Strategy

**Strategy:** Warn users at appropriate thresholds.

**Warning Threshold (80%):**
- Inform user of usage
- Suggest quota conservation
- Show remaining quota
- Optional: upgrade prompt

**Critical Threshold (90%):**
- Strong warning
- Block non-essential operations
- Require confirmation for operations
- Strong upgrade suggestion

**Limit Reached (100%):**
- Block all operations
- Show upgrade prompt
- Provide clear guidance
- Offer upgrade option

### Quota Reset Times

**Reads and Writes:**
- Reset daily at midnight Pacific Time
- 50,000 reads per day
- 20,000 writes per day

**Deletes:**
- Reset monthly on billing date
- 20,000 deletes per month
- Different reset period than reads/writes

**Strategy:**
1. Track reset times
2. Display reset time to users
3. Plan operations accordingly
4. Consider time zones

## Common Mistakes to Avoid

1. ❌ Hardcoding quota values
   - ✅ Use FREE_TIER_LIMITS constant

2. ❌ Not calculating quota correctly
   - ✅ Use calculateQuotaUsage()

3. ❌ Ignoring monthly delete quota
   - ✅ Remember deletes are monthly

4. ❌ Not warning at thresholds
   - ✅ Use isQuotaThresholdReached()

5. ❌ Mixing daily and monthly quotas
   - ✅ Track separately

## AI Agent Instructions

### When Calculating Quota

1. Collect operation counts (reads, writes, deletes)
2. Call calculateQuotaUsage()
3. Check returned percentages
4. Compare with thresholds
5. Display to user if needed

### When Checking Thresholds

1. Calculate quota usage first
2. Call isQuotaThresholdReached(metrics, 80) for warning
3. Call isQuotaThresholdReached(metrics, 90) for critical
4. Display appropriate warning
5. Throttle operations if critical

### When Displaying Quota Info

1. Calculate current usage
2. Show used/limit for each type
3. Show percentage used
4. Display reset time
5. Suggest upgrade if near limit

## Code Quality Standards

### Constants

- Export all constants
- Use descriptive names
- Document reset periods
- Group related constants
- No magic numbers

### Utility Functions

- Type all parameters
- Type all returns
- Handle edge cases
- Document behavior
- Include examples in comments

## Performance Considerations

### Calculation Overhead

- Minimal overhead for calculations
- Simple arithmetic operations
- No network calls
- Safe for frequent use
- Cache results if needed

### Monitoring Frequency

- Don't calculate on every operation
- Calculate periodically (hourly)
- Calculate after batches
- Cache results
- Update UI efficiently

## Related Documentation

- [Firestore Module README](../../README.md)
- [Firestore Errors README](../errors/README.md)
- [Quota Error Detector README](../../utils/quota-error-detector/README.md)
- [Request Log Types README](../../entities/README.md)

## API Reference

### Constants

**Import Path:** `@umituz/react-native-firebase/firestore` or `src/firestore/domain/constants`

| Constant | Type | Values |
|----------|------|--------|
| `FREE_TIER_LIMITS` | Object | { dailyReads: 50000, dailyWrites: 20000, monthlyDeletes: 20000 } |
| `QUOTA_THRESHOLDS` | Object | { warning: 80, critical: 90 } |

### Utility Functions

| Function | Parameters | Returns | Description |
|----------|-----------|---------|-------------|
| `calculateQuotaUsage` | `{ reads, writes, deletes }` | `QuotaMetrics` | Calculate usage percentages |
| `isQuotaThresholdReached` | `metrics, threshold` | `boolean` | Check if threshold reached |

---

**Last Updated:** 2025-01-08
**Maintainer:** Firestore Module Team
